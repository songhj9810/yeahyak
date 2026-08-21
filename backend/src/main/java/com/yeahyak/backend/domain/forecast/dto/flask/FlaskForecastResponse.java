package com.yeahyak.backend.domain.forecast.dto.flask;

public record FlaskForecastResponse(
        Long productId,
        Integer forecastQty,
        Integer currentStock,
        Integer recommendQty) {
}
