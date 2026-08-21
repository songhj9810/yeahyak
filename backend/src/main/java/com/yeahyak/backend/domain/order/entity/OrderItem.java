package com.yeahyak.backend.domain.order.entity;

import com.yeahyak.backend.domain.product.entity.Product;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private Integer quantity;

    @Builder
    private OrderItem(Order order, Product product, Integer price, Integer quantity) {
        this.order = order;
        this.product = product;
        this.price = price;
        this.quantity = quantity;
    }

    public static OrderItem create(Order order, Product product, Integer quantity) {
        return OrderItem.builder()
                .order(order)
                .product(product)
                .price(product.getPrice())
                .quantity(quantity)
                .build();
    }

    public Integer getTotalPrice() {
        return this.price * this.quantity;
    }
}
