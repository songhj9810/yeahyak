package com.yeahyak.backend.domain.forecast.dto.response;

import java.time.LocalDateTime;

public record LastSalesUploadResponse(
        LocalDateTime createdAt,
        boolean outdated) {
}
