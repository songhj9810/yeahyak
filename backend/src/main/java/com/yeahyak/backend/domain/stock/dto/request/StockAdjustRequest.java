package com.yeahyak.backend.domain.stock.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record StockAdjustRequest(
        @NotNull @Min(0) Integer newStock) {
}
