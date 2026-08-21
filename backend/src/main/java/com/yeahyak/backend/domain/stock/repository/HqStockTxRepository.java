package com.yeahyak.backend.domain.stock.repository;

import com.yeahyak.backend.domain.stock.entity.HqStockEvent;
import com.yeahyak.backend.domain.stock.entity.HqStockTx;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface HqStockTxRepository extends JpaRepository<HqStockTx, Long> {
    @Query("""
            SELECT t FROM HqStockTx t
            WHERE (t.hqStock.id = :hqStockId)
              AND (:event IS NULL OR t.event = :event)
              AND (:start IS NULL OR t.createdAt >= :start)
              AND (:end IS NULL OR t.createdAt <= :end)
            """)
    Page<HqStockTx> searchHqStockTxs(@Param("hqStockId") Long hqStockId,
                                     @Param("event") HqStockEvent event,
                                     @Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end,
                                     Pageable pageable);
}
