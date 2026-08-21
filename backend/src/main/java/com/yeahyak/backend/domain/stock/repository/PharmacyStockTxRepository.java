package com.yeahyak.backend.domain.stock.repository;

import com.yeahyak.backend.domain.stock.entity.PharmacyStockEvent;
import com.yeahyak.backend.domain.stock.entity.PharmacyStockTx;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PharmacyStockTxRepository extends JpaRepository<PharmacyStockTx, Long> {
    @Query("""
            SELECT t FROM PharmacyStockTx t
            WHERE (t.pharmacyStock.id = :pharmacyStockId)
              AND (:event IS NULL OR t.event = :event)
              AND (:start IS NULL OR t.createdAt >= :start)
              AND (:end IS NULL OR t.createdAt <= :end)
            """)
    Page<PharmacyStockTx> searchPharmacyStockTxs(@Param("pharmacyStockId") Long pharmacyStockId,
                                                 @Param("event") PharmacyStockEvent event,
                                                 @Param("start") LocalDateTime start,
                                                 @Param("end") LocalDateTime end,
                                                 Pageable pageable);

    // 판매일자 기준 중복 확인
    Optional<PharmacyStockTx> findByPharmacyStockIdAndEventAndSaleDate(Long pharmacyStockId,
                                                                       PharmacyStockEvent event,
                                                                       LocalDate saleDate);

    // 마지막 판매 데이터 업로드 날짜 조회
    @Query("""
            SELECT MAX(t.createdAt) FROM PharmacyStockTx t
            WHERE (t.pharmacyStock.pharmacy.id = :pharmacyId)
              AND (t.event = 'SALE_OUT')
            """)
    Optional<LocalDateTime> findLastSalesUpload(@Param("pharmacyId") Long pharmacyId);

    // Flask 전달용 SALE_OUT 전체 조회
    @Query("""
            SELECT t FROM PharmacyStockTx t
            JOIN FETCH t.pharmacyStock s
            JOIN FETCH s.product p
            WHERE (s.pharmacy.id = :pharmacyId)
              AND (t.event = 'SALE_OUT')
              AND (t.saleDate >= :from)
            ORDER BY t.saleDate ASC
            """)
    List<PharmacyStockTx> findAllSaleOut(@Param("pharmacyId") Long pharmacyId,
                                         @Param("from") LocalDate from);
}
