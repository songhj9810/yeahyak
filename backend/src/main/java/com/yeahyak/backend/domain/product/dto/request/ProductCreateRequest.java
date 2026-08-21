package com.yeahyak.backend.domain.product.dto.request;

import com.yeahyak.backend.domain.product.entity.ProductMainCategory;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductCreateRequest(
        @NotBlank String name,
        @NotBlank String kdCode,
        @NotNull ProductMainCategory mainCategory,
        @NotNull ProductSubCategory subCategory,
        @NotBlank String manufacturer,
        String unit,
        @NotNull @Min(0) Integer price,
        String description) {
}
