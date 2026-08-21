package com.yeahyak.backend.domain.product.repository;

import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.product.entity.ProductMainCategory;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByKdCode(String kdCode);

    @Query("""
            SELECT p FROM Product p
            JOIN FETCH p.hqStock
            WHERE p.id = :id
            """)
    Optional<Product> findByIdWithHqStock(@Param("id") Long id);

    @Query("""
            SELECT p FROM Product p
            WHERE (p.mainCategory = :mainCategory)
              AND (:subCategory IS NULL OR p.subCategory = :subCategory)
              AND (:keyword IS NULL OR p.name LIKE %:keyword%)
            """)
    Page<Product> searchProducts(@Param("mainCategory") ProductMainCategory mainCategory,
                                 @Param("subCategory") ProductSubCategory subCategory,
                                 @Param("keyword") String keyword,
                                 Pageable pageable);
}
