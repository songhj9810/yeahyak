package com.yeahyak.backend.domain.order.repository;

import com.yeahyak.backend.domain.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("""
            SELECT oi FROM OrderItem oi
            JOIN FETCH oi.product
            WHERE oi.order.id = :orderId
            """)
    List<OrderItem> findByOrderIdWithProduct(@Param("orderId") Long orderId);

    @Query("""
            SELECT oi.id AS orderItemId,
                   oi.quantity - COALESCE(SUM(
                       CASE WHEN ri.id IS NOT NULL
                            AND r.status != 'REJECTED'
                       THEN ri.quantity
                       ELSE 0
                       END
                   ), 0) AS returnableQuantity
            FROM OrderItem oi
            LEFT JOIN ReturnOrderItem ri ON ri.orderItem = oi
            LEFT JOIN ri.returnOrder r
            WHERE oi.id IN :orderItemIds
            GROUP BY oi.id, oi.quantity
            """)
    List<ReturnableQuantity> findReturnableQuantities(@Param("orderItemIds") List<Long> orderItemIds);

    interface ReturnableQuantity {
        Long getOrderItemId();

        Integer getReturnableQuantity();
    }
}
