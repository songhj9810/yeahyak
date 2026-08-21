package com.yeahyak.backend.domain.returnorder.dto.response;

import com.yeahyak.backend.domain.returnorder.entity.ReturnOrder;
import com.yeahyak.backend.domain.returnorder.entity.ReturnOrderStatus;

import java.time.LocalDateTime;

public record PharmacyReturnOrderListResponse(
        Long id,
        ReturnOrderStatus status,
        String summary,
        Integer totalPrice,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public static PharmacyReturnOrderListResponse from(ReturnOrder returnOrder, String summary) {
        return new PharmacyReturnOrderListResponse(
                returnOrder.getId(),
                returnOrder.getStatus(),
                summary,
                returnOrder.getTotalPrice(),
                returnOrder.getCreatedAt(),
                returnOrder.getUpdatedAt());
    }
}
