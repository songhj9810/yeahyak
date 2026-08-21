package com.yeahyak.backend.domain.order.repository;

import com.yeahyak.backend.domain.order.entity.Order;
import com.yeahyak.backend.domain.order.entity.OrderStatus;
import com.yeahyak.backend.domain.user.entity.PharmacyRegion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface OrderRepository extends JpaRepository<Order, Long> {
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByStatusAndCreatedAtBetween(OrderStatus status, LocalDateTime start, LocalDateTime end);

    @Query("""
            SELECT COALESCE(SUM(oi.price * oi.quantity), 0) FROM OrderItem oi
            WHERE (oi.order.createdAt BETWEEN :start AND :end)
              AND (oi.order.status != 'CANCELED')
            """)
    long sumTotalPriceByCreatedAtBetween(@Param("start") LocalDateTime start,
                                         @Param("end") LocalDateTime end);

    @Query(value = """
            SELECT o FROM Order o
            JOIN FETCH o.pharmacy p
            WHERE (:region IS NULL OR p.region = :region)
              AND (:status IS NULL OR o.status = :status)
              AND (:start IS NULL OR o.createdAt >= :start)
              AND (:end IS NULL OR o.createdAt <= :end)
            """,
            countQuery = """
                    SELECT COUNT(o) FROM Order o
                    JOIN o.pharmacy p
                    WHERE (:region IS NULL OR p.region = :region)
                      AND (:status IS NULL OR o.status = :status)
                      AND (:start IS NULL OR o.createdAt >= :start)
                      AND (:end IS NULL OR o.createdAt <= :end)
                    """)
    Page<Order> searchOrdersByAdmin(@Param("region") PharmacyRegion region,
                                    @Param("status") OrderStatus status,
                                    @Param("start") LocalDateTime start,
                                    @Param("end") LocalDateTime end,
                                    Pageable pageable);

    @Query(value = """
            SELECT o FROM Order o
            WHERE (o.pharmacy.user.id = :userId)
              AND (:status IS NULL OR o.status = :status)
              AND (:start IS NULL OR o.createdAt >= :start)
              AND (:end IS NULL OR o.createdAt <= :end)
            """,
            countQuery = """
                    SELECT COUNT(o) FROM Order o
                    WHERE (o.pharmacy.user.id = :userId)
                      AND (:status IS NULL OR o.status = :status)
                      AND (:start IS NULL OR o.createdAt >= :start)
                      AND (:end IS NULL OR o.createdAt <= :end)
                    """)
    Page<Order> searchOrdersByPharmacy(@Param("userId") Long userId,
                                       @Param("status") OrderStatus status,
                                       @Param("start") LocalDateTime start,
                                       @Param("end") LocalDateTime end,
                                       Pageable pageable);
}
