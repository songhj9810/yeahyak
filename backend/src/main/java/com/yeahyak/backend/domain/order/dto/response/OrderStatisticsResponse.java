package com.yeahyak.backend.domain.order.dto.response;

public record OrderStatisticsResponse(
        long total,
        long processing,
        long completed,
        long totalAmount) {
}
