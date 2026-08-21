package com.yeahyak.backend.domain.returnorder.dto.response;

import com.yeahyak.backend.domain.returnorder.entity.ReturnOrder;
import com.yeahyak.backend.domain.returnorder.entity.ReturnOrderStatus;
import com.yeahyak.backend.domain.user.entity.Pharmacy;

import java.time.LocalDateTime;

public record AdminReturnOrderListResponse(
        Long id,
        Long pharmacyId,
        String pharmacyName,
        ReturnOrderStatus status,
        String summary,
        Integer totalPrice,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public static AdminReturnOrderListResponse from(ReturnOrder returnOrder, String summary) {
        Pharmacy pharmacy = returnOrder.getPharmacy();
        return new AdminReturnOrderListResponse(
                returnOrder.getId(),
                pharmacy.getId(), // ReturnOrder → Pharmacy → id
                pharmacy.getName(), // ReturnOrder → Pharmacy → name
                returnOrder.getStatus(),
                summary,
                returnOrder.getTotalPrice(),
                returnOrder.getCreatedAt(),
                returnOrder.getUpdatedAt());
    }
}
