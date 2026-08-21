package com.yeahyak.backend.domain.returnorder.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ReturnOrderCreateRequest(
        @NotNull Long orderId,
        String returnReason,
        @NotEmpty List<ReturnOrderItemRequest> returnOrderItems) {
    public record ReturnOrderItemRequest(
            @NotNull Long orderItemId,
            @NotNull @Min(1) Integer quantity) {
    }
}
