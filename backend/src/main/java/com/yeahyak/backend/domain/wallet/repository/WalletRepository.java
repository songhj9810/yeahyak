package com.yeahyak.backend.domain.wallet.repository;

import com.yeahyak.backend.domain.wallet.entity.Wallet;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByPharmacyId(Long pharmacyId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT w FROM Wallet w
            WHERE w.pharmacy.id = :pharmacyId
            """)
    Optional<Wallet> findByPharmacyIdWithLock(@Param("pharmacyId") Long pharmacyId);

    Optional<Wallet> findByPharmacyUserId(Long userId);
}
