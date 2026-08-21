package com.yeahyak.backend.domain.forecast.dto.flask;

import java.util.List;

public record FlaskForecastRequest(
        Long pharmacyId,
        List<Product> products,
        Integer forecastDays,
        String today) {

    public record Product(
            Long productId,
            String mainCategory,
            String subCategory,
            Integer currentStock,
            List<SalesHistory> salesHistory) {
    }

    public record SalesHistory(
            String date,
            Integer qty) {
    }
}
