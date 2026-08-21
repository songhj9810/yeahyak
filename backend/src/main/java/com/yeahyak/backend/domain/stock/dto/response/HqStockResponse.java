package com.yeahyak.backend.domain.stock.dto.response;

import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import com.yeahyak.backend.domain.stock.entity.HqStock;

public record HqStockResponse(
        Long id,
        Long productId,
        String name,
        String kdCode,
        ProductSubCategory subCategory,
        String manufacturer,
        String unit,
        Integer price,
        String imageUrl,
        Integer stock) {
    public static HqStockResponse from(HqStock hqStock) {
        Product product = hqStock.getProduct();
        return new HqStockResponse(
                hqStock.getId(),
                product.getId(), // HqStock → Product → id
                product.getName(), // HqStock → Product → name
                product.getKdCode(), // HqStock → Product → kdCode
                product.getSubCategory(), // HqStock → Product → subCategory
                product.getManufacturer(), // HqStock → Product → manufacturer
                product.getUnit(), // HqStock → Product → unit
                product.getPrice(), // HqStock → Product → price
                product.getImageUrl(), // HqStock → Product → imageUrl
                hqStock.getStock());
    }
}
