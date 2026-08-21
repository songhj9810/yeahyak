package com.yeahyak.backend.domain.returnorder.dto.response;

public record ReturnOrderStatisticsResponse(
        long total,
        long processing,
        long completed,
        long totalAmount) {
}
