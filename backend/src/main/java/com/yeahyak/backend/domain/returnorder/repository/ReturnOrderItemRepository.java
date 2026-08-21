package com.yeahyak.backend.domain.returnorder.repository;

import com.yeahyak.backend.domain.returnorder.entity.ReturnOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReturnOrderItemRepository extends JpaRepository<ReturnOrderItem, Long> {
    @Query("""
            SELECT ri FROM ReturnOrderItem ri
            JOIN FETCH ri.orderItem oi
            JOIN FETCH oi.product
            WHERE ri.returnOrder.id = :returnOrderId
            """)
    List<ReturnOrderItem> findByReturnOrderIdWithProduct(@Param("returnOrderId") Long returnOrderId);
}
