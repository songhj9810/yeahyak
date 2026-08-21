package com.yeahyak.backend.domain.stock.repository;

import com.yeahyak.backend.domain.product.entity.ProductMainCategory;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import com.yeahyak.backend.domain.stock.entity.HqStock;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface HqStockRepository extends JpaRepository<HqStock, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT s FROM HqStock s
            WHERE s.id = :id
            """)
    Optional<HqStock> findByIdWithLock(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT s FROM HqStock s
            WHERE s.product.id = :productId
            """)
    Optional<HqStock> findByProductIdWithLock(@Param("productId") Long productId);

    @Query(value = """
            SELECT s FROM HqStock s
            JOIN FETCH s.product p
            WHERE (:mainCategory IS NULL OR p.mainCategory = :mainCategory)
              AND (:subCategory IS NULL OR p.subCategory = :subCategory)
              AND (:keyword IS NULL OR p.name LIKE %:keyword%)
              AND (:threshold IS NULL OR s.stock <= :threshold)
            """,
            countQuery = """
                    SELECT COUNT(s) FROM HqStock s
                    JOIN s.product p
                    WHERE (:mainCategory IS NULL OR p.mainCategory = :mainCategory)
                      AND (:subCategory IS NULL OR p.subCategory = :subCategory)
                      AND (:keyword IS NULL OR p.name LIKE %:keyword%)
                      AND (:threshold IS NULL OR s.stock <= :threshold)
                    """)
    Page<HqStock> searchHqStocks(@Param("mainCategory") ProductMainCategory mainCategory,
                                 @Param("subCategory") ProductSubCategory subCategory,
                                 @Param("keyword") String keyword,
                                 @Param("threshold") Integer threshold,
                                 Pageable pageable);
}
