package com.yeahyak.backend.domain.stock.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "hq_stock_tx")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class HqStockTx {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hq_stock_id", nullable = false)
    private HqStock hqStock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HqStockEvent event;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer stockBefore;

    @Column(nullable = false)
    private Integer stockAfter;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private Long orderItemId;

    private Long returnOrderItemId;

    @Builder
    private HqStockTx(HqStock hqStock, HqStockEvent event, Integer quantity,
                      Integer stockBefore, Integer stockAfter,
                      Long orderItemId, Long returnOrderItemId) {
        this.hqStock = hqStock;
        this.event = event;
        this.quantity = quantity;
        this.stockBefore = stockBefore;
        this.stockAfter = stockAfter;
        this.orderItemId = orderItemId;
        this.returnOrderItemId = returnOrderItemId;
    }

    public static HqStockTx create(HqStock hqStock, HqStockEvent event, Integer quantity,
                                   Integer stockBefore, Integer stockAfter,
                                   Long orderItemId, Long returnOrderItemId) {
        return HqStockTx.builder()
                .hqStock(hqStock)
                .event(event)
                .quantity(quantity)
                .stockBefore(stockBefore)
                .stockAfter(stockAfter)
                .orderItemId(orderItemId)
                .returnOrderItemId(returnOrderItemId)
                .build();
    }
}
