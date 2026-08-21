package com.yeahyak.backend.domain.order.dto.response;

import com.yeahyak.backend.domain.order.entity.Order;
import com.yeahyak.backend.domain.order.entity.OrderStatus;

import java.time.LocalDateTime;

public record PharmacyOrderListResponse(
        Long id,
        OrderStatus status,
        String summary,
        Integer totalPrice,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public static PharmacyOrderListResponse from(Order order, String summary) {
        return new PharmacyOrderListResponse(
                order.getId(),
                order.getStatus(),
                summary,
                order.getTotalPrice(),
                order.getCreatedAt(),
                order.getUpdatedAt());
    }
}
