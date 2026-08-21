package com.yeahyak.backend.domain.product.controller;

import com.yeahyak.backend.domain.product.dto.request.ProductCreateRequest;
import com.yeahyak.backend.domain.product.dto.request.ProductUpdateRequest;
import com.yeahyak.backend.domain.product.dto.response.ProductCreateResponse;
import com.yeahyak.backend.domain.product.dto.response.ProductListResponse;
import com.yeahyak.backend.domain.product.dto.response.ProductResponse;
import com.yeahyak.backend.domain.product.entity.ProductMainCategory;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import com.yeahyak.backend.domain.product.service.ProductService;
import com.yeahyak.backend.global.response.ApiResponse;
import com.yeahyak.backend.global.response.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 상품 등록
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductCreateResponse>> createProduct(
            @RequestPart(value = "request") @Valid ProductCreateRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(ApiResponse.ok(
                productService.createProduct(request, image)));
    }

    // 상품 수정
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping(value = "/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> updateProduct(
            @PathVariable Long productId,
            @RequestPart(value = "request") @Valid ProductUpdateRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        productService.updateProduct(productId, request, image);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 상품 삭제
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 상품 목록 조회
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductListResponse>>> getProducts(
            @RequestParam ProductMainCategory mainCategory,
            @RequestParam(required = false) ProductSubCategory subCategory,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                productService.getProducts(mainCategory, subCategory, keyword, pageable)));
    }

    // 상품 상세 조회
    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(
            @PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.ok(
                productService.getProduct(productId)));
    }
}
