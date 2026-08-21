package com.yeahyak.backend.domain.forecast.dto.response;

import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.product.entity.ProductMainCategory;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;

public record ForecastResponse(
        Long productId,
        String productName,
        ProductMainCategory mainCategory,
        ProductSubCategory subCategory,
        String manufacturer,
        Integer price,
        String imageUrl,
        Integer forecastQty,
        Integer currentStock,
        Integer recommendQty) {
    public static ForecastResponse from(Product product, Integer forecastQty, Integer currentStock, Integer recommendQty) {
        return new ForecastResponse(
                product.getId(),
                product.getName(),
                product.getMainCategory(),
                product.getSubCategory(),
                product.getManufacturer(),
                product.getPrice(),
                product.getImageUrl(),
                forecastQty,
                currentStock,
                recommendQty);
    }
}
