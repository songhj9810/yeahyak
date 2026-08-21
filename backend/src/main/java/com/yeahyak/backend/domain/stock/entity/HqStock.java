package com.yeahyak.backend.domain.stock.entity;

import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hq_stocks")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HqStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false)
    private Integer stock;

    @Builder
    private HqStock(Product product, Integer stock) {
        this.product = product;
        this.stock = stock;
    }

    public static HqStock create(Product product) {
        return HqStock.builder()
                .product(product)
                .stock(0)
                .build();
    }

    // 발주 생성 시 출고
    public HqStockTx orderOut(Integer quantity, Long orderItemId) {
        if (this.stock < quantity) {
            throw new CustomException(ErrorCode.INSUFFICIENT_STOCK);
        }
        Integer before = this.stock;
        this.stock -= quantity;
        return HqStockTx.create(this, HqStockEvent.ORDER_OUT, quantity, before, this.stock, orderItemId, null);
    }

    // 발주 취소 시 입고
    public HqStockTx cancelIn(Integer quantity, Long orderItemId) {
        Integer before = this.stock;
        this.stock += quantity;
        return HqStockTx.create(this, HqStockEvent.CANCEL_IN, quantity, before, this.stock, orderItemId, null);
    }

    // 반품 완료 시 입고
    public HqStockTx returnOrderIn(Integer quantity, Long returnOrderItemId) {
        Integer before = this.stock;
        this.stock += quantity;
        return HqStockTx.create(this, HqStockEvent.RETURN_ORDER_IN, quantity, before, this.stock, null, returnOrderItemId);
    }

    // 재고 수동 조정
    public HqStockTx adjust(Integer newStock) {
        Integer before = this.stock;
        this.stock = newStock;
        return HqStockTx.create(this, HqStockEvent.ADJUST, newStock, before, this.stock, null, null);
    }
}
