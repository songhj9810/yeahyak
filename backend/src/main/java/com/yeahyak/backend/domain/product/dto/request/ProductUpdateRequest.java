package com.yeahyak.backend.domain.product.dto.request;

import com.yeahyak.backend.domain.product.entity.ProductMainCategory;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;

public record ProductUpdateRequest(
        String newName,
        ProductMainCategory newMainCategory,
        ProductSubCategory newSubCategory,
        String newManufacturer,
        String newUnit,
        Integer newPrice,
        String newDescription,
        boolean clearImage) {
}
