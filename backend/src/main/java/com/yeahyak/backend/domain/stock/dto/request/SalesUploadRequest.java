package com.yeahyak.backend.domain.stock.dto.request;

import java.time.LocalDate;

public record SalesUploadRequest(
        LocalDate date,
        Long productId,
        Integer quantity) {
}
