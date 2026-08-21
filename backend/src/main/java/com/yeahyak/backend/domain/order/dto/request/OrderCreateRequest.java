package com.yeahyak.backend.domain.order.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrderCreateRequest(
        @NotEmpty List<OrderItemRequest> orderItems) {
    public record OrderItemRequest(
            @NotNull Long productId,
            @NotNull @Min(1) Integer quantity) {
    }
}
