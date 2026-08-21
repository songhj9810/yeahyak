package com.yeahyak.backend.domain.returnorder.entity;

import com.yeahyak.backend.domain.order.entity.OrderItem;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "return_order_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReturnOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_order_id", nullable = false)
    private ReturnOrder returnOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @Column(nullable = false)
    private Integer quantity;

    @Builder
    private ReturnOrderItem(ReturnOrder returnOrder, OrderItem orderItem, Integer quantity) {
        this.returnOrder = returnOrder;
        this.orderItem = orderItem;
        this.quantity = quantity;
    }

    public static ReturnOrderItem create(ReturnOrder returnOrder, OrderItem orderItem, Integer quantity) {
        return ReturnOrderItem.builder()
                .returnOrder(returnOrder)
                .orderItem(orderItem)
                .quantity(quantity)
                .build();
    }

    public Integer getTotalPrice() {
        return this.orderItem.getPrice() * this.quantity;
    }
}
