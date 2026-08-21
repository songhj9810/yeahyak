package com.yeahyak.backend.domain.stock.dto.response;

import com.yeahyak.backend.domain.stock.entity.HqStockEvent;
import com.yeahyak.backend.domain.stock.entity.HqStockTx;

import java.time.LocalDateTime;

public record HqStockTxResponse(
        Long id,
        HqStockEvent event,
        Integer quantity,
        Integer stockBefore,
        Integer stockAfter,
        LocalDateTime createdAt,
        Long orderItemId,
        Long returnOrderItemId) {
    public static HqStockTxResponse from(HqStockTx tx) {
        return new HqStockTxResponse(
                tx.getId(),
                tx.getEvent(),
                tx.getQuantity(),
                tx.getStockBefore(),
                tx.getStockAfter(),
                tx.getCreatedAt(),
                tx.getOrderItemId(),
                tx.getReturnOrderItemId());
    }
}
