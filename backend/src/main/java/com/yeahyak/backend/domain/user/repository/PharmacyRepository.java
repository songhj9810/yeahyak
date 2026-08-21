package com.yeahyak.backend.domain.user.repository;

import com.yeahyak.backend.domain.user.entity.Pharmacy;
import com.yeahyak.backend.domain.user.entity.PharmacyRegion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {
    boolean existsByBrn(String brn);

    Optional<Pharmacy> findByUserId(Long userId);

    @Query("""
            SELECT p FROM Pharmacy p
            JOIN FETCH p.user
            JOIN FETCH p.wallet
            WHERE p.user.id = :userId
            """)
    Optional<Pharmacy> findByUserIdWithUserAndWallet(@Param("userId") Long userId);

    @Query("""
            SELECT p FROM Pharmacy p
            JOIN FETCH p.user
            JOIN FETCH p.wallet
            WHERE p.id = :id
            """)
    Optional<Pharmacy> findByIdWithUserAndWallet(@Param("id") Long id);

    @Query(value = """
            SELECT p FROM Pharmacy p
            JOIN FETCH p.user
            JOIN FETCH p.wallet w
            WHERE (:region IS NULL OR p.region = :region)
              AND (:lowBalance IS FALSE OR (w.quota > 0 AND w.balance < w.quota * 0.2))
              AND (:keyword IS NULL OR p.name LIKE %:keyword%)
            """,
            countQuery = """
                    SELECT COUNT(p) FROM Pharmacy p
                    JOIN p.wallet w
                    WHERE (:region IS NULL OR p.region = :region)
                      AND (:lowBalance IS FALSE OR (w.quota > 0 AND w.balance < w.quota * 0.2))
                      AND (:keyword IS NULL OR p.name LIKE %:keyword%)
                    """)
    Page<Pharmacy> searchPharmacies(@Param("region") PharmacyRegion region,
                                    @Param("lowBalance") boolean lowBalance,
                                    @Param("keyword") String keyword,
                                    Pageable pageable);
}
