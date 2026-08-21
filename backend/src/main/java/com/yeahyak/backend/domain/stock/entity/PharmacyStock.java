package com.yeahyak.backend.domain.stock.entity;

import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.user.entity.Pharmacy;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "pharmacy_stocks", uniqueConstraints = @UniqueConstraint(columnNames = {"pharmacy_id", "product_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PharmacyStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacy_id", nullable = false)
    private Pharmacy pharmacy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer stock;

    @Builder
    private PharmacyStock(Pharmacy pharmacy, Product product, Integer stock) {
        this.pharmacy = pharmacy;
        this.product = product;
        this.stock = stock;
    }

    public static PharmacyStock create(Pharmacy pharmacy, Product product) {
        return PharmacyStock.builder()
                .pharmacy(pharmacy)
                .product(product)
                .stock(0)
                .build();
    }

    // 발주 완료 시 입고
    public PharmacyStockTx orderIn(Integer quantity, Long orderItemId) {
        Integer before = this.stock;
        this.stock += quantity;
        return PharmacyStockTx.create(this, PharmacyStockEvent.ORDER_IN, quantity, before, this.stock, null, orderItemId, null);
    }

    // 반품 승인 시 출고
    public PharmacyStockTx returnOrderOut(Integer quantity, Long returnOrderItemId) {
        if (this.stock < quantity) {
            throw new CustomException(ErrorCode.INSUFFICIENT_STOCK);
        }
        Integer before = this.stock;
        this.stock -= quantity;
        return PharmacyStockTx.create(this, PharmacyStockEvent.RETURN_ORDER_OUT, quantity, before, this.stock, null, null, returnOrderItemId);
    }

    // 재고 수동 조정
    public PharmacyStockTx adjust(Integer newStock) {
        Integer before = this.stock;
        this.stock = newStock;
        return PharmacyStockTx.create(this, PharmacyStockEvent.ADJUST, newStock, before, this.stock, null, null, null);
    }

    // 판매 시 출고
    public PharmacyStockTx saleOut(Integer quantity, LocalDate saleDate) {
        // if (this.stock < quantity) {
        //     throw new CustomException(ErrorCode.INSUFFICIENT_STOCK);
        // }
        Integer before = this.stock;
        this.stock -= quantity; // 마이너스 허용
        return PharmacyStockTx.create(this, PharmacyStockEvent.SALE_OUT, quantity, before, this.stock, saleDate, null, null);
    }

    public void revertSaleOut(Integer quantity) {
        this.stock += quantity;
    }
}
