package com.yeahyak.backend.domain.stock.dto.response;

import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import com.yeahyak.backend.domain.stock.entity.PharmacyStock;

public record PharmacyStockResponse(
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
    public static PharmacyStockResponse from(PharmacyStock pharmacyStock) {
        Product product = pharmacyStock.getProduct();
        return new PharmacyStockResponse(
                pharmacyStock.getId(),
                product.getId(), // PharmacyStock → Product → id
                product.getName(), // PharmacyStock → Product → name
                product.getKdCode(), // PharmacyStock → Product → kdCode
                product.getSubCategory(), // PharmacyStock → Product → subCategory
                product.getManufacturer(), // PharmacyStock → Product → manufacturer
                product.getUnit(), // PharmacyStock → Product → unit
                product.getPrice(), // PharmacyStock → Product → price
                product.getImageUrl(), // PharmacyStock → Product → imageUrl
                pharmacyStock.getStock()
        );
    }
}
