package com.yeahyak.backend.domain.stock.controller;

import com.yeahyak.backend.domain.product.entity.ProductMainCategory;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import com.yeahyak.backend.domain.stock.dto.request.StockAdjustRequest;
import com.yeahyak.backend.domain.stock.dto.response.HqStockResponse;
import com.yeahyak.backend.domain.stock.dto.response.HqStockTxResponse;
import com.yeahyak.backend.domain.stock.entity.HqStockEvent;
import com.yeahyak.backend.domain.stock.service.HqStockService;
import com.yeahyak.backend.global.response.ApiResponse;
import com.yeahyak.backend.global.response.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/stocks/hq")
@RequiredArgsConstructor
public class HqStockController {

    private final HqStockService hqStockService;

    // 본사 재고 목록 조회
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<HqStockResponse>>> getHqStocks(
            @RequestParam(required = false) ProductMainCategory mainCategory,
            @RequestParam(required = false) ProductSubCategory subCategory,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer threshold,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                hqStockService.getHqStocks(mainCategory, subCategory, keyword, threshold, pageable)));
    }

    // 본사 재고 단건 조회
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{hqStockId}")
    public ResponseEntity<ApiResponse<HqStockResponse>> getHqStock(
            @PathVariable Long hqStockId) {
        return ResponseEntity.ok(ApiResponse.ok(
                hqStockService.getHqStock(hqStockId)));
    }

    // 본사 재고 변동 내역 조회
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{hqStockId}/transactions")
    public ResponseEntity<ApiResponse<PageResponse<HqStockTxResponse>>> getHqStockTxs(
            @PathVariable Long hqStockId,
            @RequestParam(required = false) HqStockEvent event,
            @RequestParam(required = false) LocalDateTime start,
            @RequestParam(required = false) LocalDateTime end,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                hqStockService.getHqStockTxs(hqStockId, event, start, end, pageable)));
    }

    // 본사 재고 수동 조정
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{hqStockId}/adjust")
    public ResponseEntity<ApiResponse<Void>> adjust(
            @PathVariable Long hqStockId,
            @RequestBody @Valid StockAdjustRequest request) {
        hqStockService.adjust(hqStockId, request);
        return ResponseEntity.ok(ApiResponse.ok());
    }
}
