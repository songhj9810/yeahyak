package com.yeahyak.backend.domain.stock.controller;

import com.yeahyak.backend.domain.product.entity.ProductMainCategory;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import com.yeahyak.backend.domain.stock.dto.request.StockAdjustRequest;
import com.yeahyak.backend.domain.stock.dto.response.PharmacyStockResponse;
import com.yeahyak.backend.domain.stock.dto.response.PharmacyStockTxResponse;
import com.yeahyak.backend.domain.stock.entity.PharmacyStockEvent;
import com.yeahyak.backend.domain.stock.service.PharmacyStockService;
import com.yeahyak.backend.global.response.ApiResponse;
import com.yeahyak.backend.global.response.PageResponse;
import com.yeahyak.backend.global.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/stocks/me")
@RequiredArgsConstructor
public class PharmacyStockController {

    private final PharmacyStockService pharmacyStockService;

    // 약국 재고 목록 조회
    @PreAuthorize("hasRole('PHARMACY')")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PharmacyStockResponse>>> getPharmacyStocks(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) ProductMainCategory mainCategory,
            @RequestParam(required = false) ProductSubCategory subCategory,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer threshold,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                pharmacyStockService.getPharmacyStocks(userDetails.getId(), mainCategory, subCategory, keyword, threshold, pageable)));
    }

    // 약국 재고 단건 조회
    @PreAuthorize("hasRole('PHARMACY')")
    @GetMapping("/{pharmacyStockId}")
    public ResponseEntity<ApiResponse<PharmacyStockResponse>> getPharmacyStock(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long pharmacyStockId) {
        return ResponseEntity.ok(ApiResponse.ok(
                pharmacyStockService.getPharmacyStock(userDetails.getId(), pharmacyStockId)));
    }

    // 약국 재고 변동 내역 조회
    @PreAuthorize("hasRole('PHARMACY')")
    @GetMapping("/{pharmacyStockId}/transactions")
    public ResponseEntity<ApiResponse<PageResponse<PharmacyStockTxResponse>>> getPharmacyStockTxs(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long pharmacyStockId,
            @RequestParam(required = false) PharmacyStockEvent event,
            @RequestParam(required = false) LocalDateTime start,
            @RequestParam(required = false) LocalDateTime end,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                pharmacyStockService.getPharmacyStockTxs(userDetails.getId(), pharmacyStockId, event, start, end, pageable)));
    }

    // 약국 재고 수동 조정
    @PreAuthorize("hasRole('PHARMACY')")
    @PatchMapping("/{pharmacyStockId}/adjust")
    public ResponseEntity<ApiResponse<Void>> adjust(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long pharmacyStockId,
            @RequestBody @Valid StockAdjustRequest request) {
        pharmacyStockService.adjust(userDetails.getId(), pharmacyStockId, request);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 판매 데이터 업로드
    @PostMapping(value = "/sales", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<ApiResponse<Void>> uploadSales(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        pharmacyStockService.uploadSales(userDetails.getId(), file);
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
