package com.yeahyak.backend.domain.order.dto.response;

import com.yeahyak.backend.domain.order.entity.Order;
import com.yeahyak.backend.domain.order.entity.OrderStatus;
import com.yeahyak.backend.domain.user.entity.Pharmacy;

import java.time.LocalDateTime;

public record AdminOrderListResponse(
        Long id,
        Long pharmacyId,
        String pharmacyName,
        OrderStatus status,
        String summary,
        Integer totalPrice,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public static AdminOrderListResponse from(Order order, String summary) {
        Pharmacy pharmacy = order.getPharmacy();
        return new AdminOrderListResponse(
                order.getId(),
                pharmacy.getId(), // Order → Pharmacy → id
                pharmacy.getName(), // Order → Pharmacy → name
                order.getStatus(),
                summary,
                order.getTotalPrice(),
                order.getCreatedAt(),
                order.getUpdatedAt());
    }
}
