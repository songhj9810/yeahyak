package com.yeahyak.backend.domain.product.dto.response;


import com.yeahyak.backend.domain.product.entity.Product;

public record ProductListResponse(
        Long id,
        String name,
        String manufacturer,
        String unit,
        Integer price,
        String imageUrl) {
    public static ProductListResponse from(Product product) {
        return new ProductListResponse(
                product.getId(),
                product.getName(),
                product.getManufacturer(),
                product.getUnit(),
                product.getPrice(),
                product.getImageUrl());
    }
}
