package com.yeahyak.backend.domain.returnorder.controller;

import com.yeahyak.backend.domain.returnorder.dto.request.ReturnOrderCreateRequest;
import com.yeahyak.backend.domain.returnorder.dto.request.ReturnOrderRejectRequest;
import com.yeahyak.backend.domain.returnorder.dto.response.AdminReturnOrderListResponse;
import com.yeahyak.backend.domain.returnorder.dto.response.PharmacyReturnOrderListResponse;
import com.yeahyak.backend.domain.returnorder.dto.response.ReturnOrderResponse;
import com.yeahyak.backend.domain.returnorder.dto.response.ReturnOrderStatisticsResponse;
import com.yeahyak.backend.domain.returnorder.entity.ReturnOrderStatus;
import com.yeahyak.backend.domain.returnorder.service.ReturnOrderService;
import com.yeahyak.backend.domain.user.entity.PharmacyRegion;
import com.yeahyak.backend.global.response.ApiResponse;
import com.yeahyak.backend.global.response.PageResponse;
import com.yeahyak.backend.global.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
public class ReturnOrderController {

    private final ReturnOrderService returnOrderService;

    // 반품 생성
    @PreAuthorize("hasRole('PHARMACY')")
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createReturnOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid ReturnOrderCreateRequest request) {
        returnOrderService.createReturnOrder(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 반품 승인
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{returnOrderId}/approve")
    public ResponseEntity<ApiResponse<Void>> approveReturnOrder(
            @PathVariable Long returnOrderId) {
        returnOrderService.approveReturnOrder(returnOrderId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 반품 반려
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{returnOrderId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectReturnOrder(
            @PathVariable Long returnOrderId,
            @RequestBody @Valid ReturnOrderRejectRequest request) {
        returnOrderService.rejectReturnOrder(returnOrderId, request);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 반품 처리
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{returnOrderId}/process")
    public ResponseEntity<ApiResponse<Void>> processReturnOrder(
            @PathVariable Long returnOrderId) {
        returnOrderService.processReturnOrder(returnOrderId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 반품 완료
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{returnOrderId}/complete")
    public ResponseEntity<ApiResponse<Void>> completeReturnOrder(
            @PathVariable Long returnOrderId) {
        returnOrderService.completeReturnOrder(returnOrderId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 발주 통계 조회
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<ReturnOrderStatisticsResponse>> getReturnOrderStatistics() {
        return ResponseEntity.ok(ApiResponse.ok(
                returnOrderService.getReturnOrderStatistics()));
    }

    // 반품 목록 조회 (약국)
    @PreAuthorize("hasRole('PHARMACY')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PageResponse<PharmacyReturnOrderListResponse>>> getMyReturnOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) ReturnOrderStatus status,
            @RequestParam(required = false) LocalDateTime start,
            @RequestParam(required = false) LocalDateTime end,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                returnOrderService.getReturnOrdersByUserId(userDetails.getId(), status, start, end, pageable)));
    }

    // 반품 목록 조회 (어드민)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminReturnOrderListResponse>>> getReturnOrders(
            @RequestParam(required = false) PharmacyRegion region,
            @RequestParam(required = false) ReturnOrderStatus status,
            @RequestParam(required = false) LocalDateTime start,
            @RequestParam(required = false) LocalDateTime end,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                returnOrderService.getReturnOrders(region, status, start, end, pageable)));
    }

    // 반품 상세 조회
    @GetMapping("/{returnOrderId}")
    public ResponseEntity<ApiResponse<ReturnOrderResponse>> getReturnOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long returnOrderId) {
        return ResponseEntity.ok(ApiResponse.ok(
                returnOrderService.getReturnOrder(returnOrderId, userDetails.getId(), userDetails.getRole())));
    }
}
