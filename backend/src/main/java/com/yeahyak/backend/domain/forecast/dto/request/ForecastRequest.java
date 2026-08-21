package com.yeahyak.backend.domain.forecast.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ForecastRequest(
        @NotNull @Min(1) Integer forecastDays) {
}
