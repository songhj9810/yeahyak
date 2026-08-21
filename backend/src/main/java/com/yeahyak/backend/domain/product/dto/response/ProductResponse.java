package com.yeahyak.backend.domain.product.dto.response;

import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.product.entity.ProductMainCategory;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import com.yeahyak.backend.domain.stock.entity.HqStock;

import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String name,
        String kdCode,
        ProductMainCategory mainCategory,
        ProductSubCategory subCategory,
        String manufacturer,
        String unit,
        Integer price,
        String description,
        String imageUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Integer stock) {
    public static ProductResponse from(Product product) {
        HqStock hqStock = product.getHqStock();
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getKdCode(),
                product.getMainCategory(),
                product.getSubCategory(),
                product.getManufacturer(),
                product.getUnit(),
                product.getPrice(),
                product.getDescription(),
                product.getImageUrl(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                hqStock.getStock()); // Product → HqStock → stock
    }
}
