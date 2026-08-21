package com.yeahyak.backend.domain.stock.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pharmacy_stock_tx")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class PharmacyStockTx {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacy_stock_id", nullable = false)
    private PharmacyStock pharmacyStock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PharmacyStockEvent event;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer stockBefore;

    @Column(nullable = false)
    private Integer stockAfter;

    private LocalDate saleDate; // 판매일자

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private Long orderItemId;

    private Long returnOrderItemId;

    @Builder
    private PharmacyStockTx(PharmacyStock pharmacyStock, PharmacyStockEvent event, Integer quantity,
                            Integer stockBefore, Integer stockAfter, LocalDate saleDate,
                            Long orderItemId, Long returnOrderItemId) {
        this.pharmacyStock = pharmacyStock;
        this.event = event;
        this.quantity = quantity;
        this.stockBefore = stockBefore;
        this.stockAfter = stockAfter;
        this.saleDate = saleDate;
        this.orderItemId = orderItemId;
        this.returnOrderItemId = returnOrderItemId;
    }

    public static PharmacyStockTx create(PharmacyStock pharmacyStock, PharmacyStockEvent event, Integer quantity,
                                         Integer stockBefore, Integer stockAfter, LocalDate saleDate,
                                         Long orderItemId, Long returnOrderItemId) {
        return PharmacyStockTx.builder()
                .pharmacyStock(pharmacyStock)
                .event(event)
                .quantity(quantity)
                .stockBefore(stockBefore)
                .stockAfter(stockAfter)
                .saleDate(saleDate)
                .orderItemId(orderItemId)
                .returnOrderItemId(returnOrderItemId)
                .build();
    }

    // 판매일자 중복 시 덮어쓰기
    public void update(Integer quantity, Integer stockBefore, Integer stockAfter) {
        this.quantity = quantity;
        this.stockBefore = stockBefore;
        this.stockAfter = stockAfter;
    }
}
