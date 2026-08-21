package com.yeahyak.backend.domain.returnorder.repository;

import com.yeahyak.backend.domain.returnorder.entity.ReturnOrder;
import com.yeahyak.backend.domain.returnorder.entity.ReturnOrderStatus;
import com.yeahyak.backend.domain.user.entity.PharmacyRegion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface ReturnOrderRepository extends JpaRepository<ReturnOrder, Long> {
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByStatusAndCreatedAtBetween(ReturnOrderStatus status, LocalDateTime start, LocalDateTime end);

    @Query("""
            SELECT COALESCE(SUM(ri.orderItem.price * ri.quantity), 0) FROM ReturnOrderItem ri
            WHERE (ri.returnOrder.createdAt BETWEEN :start AND :end)
              AND (ri.returnOrder.status != 'REJECTED')
            """)
    long sumTotalPriceByCreatedAtBetween(@Param("start") LocalDateTime start,
                                         @Param("end") LocalDateTime end);

    @Query(value = """
            SELECT r FROM ReturnOrder r
            JOIN FETCH r.pharmacy p
            WHERE (:region IS NULL OR p.region = :region)
              AND (:status IS NULL OR r.status = :status)
              AND (:start IS NULL OR r.createdAt >= :start)
              AND (:end IS NULL OR r.createdAt <= :end)
            """,
            countQuery = """
                    SELECT COUNT(r) FROM ReturnOrder r
                    JOIN r.pharmacy p
                    WHERE (:region IS NULL OR p.region = :region)
                      AND (:status IS NULL OR r.status = :status)
                      AND (:start IS NULL OR r.createdAt >= :start)
                      AND (:end IS NULL OR r.createdAt <= :end)
                    """)
    Page<ReturnOrder> searchReturnOrdersByAdmin(@Param("region") PharmacyRegion region,
                                                @Param("status") ReturnOrderStatus status,
                                                @Param("start") LocalDateTime start,
                                                @Param("end") LocalDateTime end,
                                                Pageable pageable);

    @Query(value = """
            SELECT r FROM ReturnOrder r
            WHERE (r.pharmacy.user.id = :userId)
              AND (:status IS NULL OR r.status = :status)
              AND (:start IS NULL OR r.createdAt >= :start)
              AND (:end IS NULL OR r.createdAt <= :end)
            """,
            countQuery = """
                    SELECT COUNT(r) FROM ReturnOrder r
                    WHERE (r.pharmacy.user.id = :userId)
                      AND (:status IS NULL OR r.status = :status)
                      AND (:start IS NULL OR r.createdAt >= :start)
                      AND (:end IS NULL OR r.createdAt <= :end)
                    """)
    Page<ReturnOrder> searchReturnOrdersByPharmacy(@Param("userId") Long userId,
                                                   @Param("status") ReturnOrderStatus status,
                                                   @Param("start") LocalDateTime start,
                                                   @Param("end") LocalDateTime end,
                                                   Pageable pageable);
}
