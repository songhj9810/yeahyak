package com.yeahyak.backend.domain.stock.dto.response;

import com.yeahyak.backend.domain.stock.entity.PharmacyStockEvent;
import com.yeahyak.backend.domain.stock.entity.PharmacyStockTx;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PharmacyStockTxResponse(
        Long id,
        PharmacyStockEvent event,
        Integer quantity,
        Integer stockBefore,
        Integer stockAfter,
        LocalDate saleDate,
        LocalDateTime createdAt,
        Long orderItemId,
        Long returnOrderItemId) {
    public static PharmacyStockTxResponse from(PharmacyStockTx tx) {
        return new PharmacyStockTxResponse(
                tx.getId(),
                tx.getEvent(),
                tx.getQuantity(),
                tx.getStockBefore(),
                tx.getStockAfter(),
                tx.getSaleDate(),
                tx.getCreatedAt(),
                tx.getOrderItemId(),
                tx.getReturnOrderItemId());
    }
}
