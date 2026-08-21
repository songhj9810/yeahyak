package com.yeahyak.backend.domain.order.controller;

import com.yeahyak.backend.domain.order.dto.request.OrderCreateRequest;
import com.yeahyak.backend.domain.order.dto.response.*;
import com.yeahyak.backend.domain.order.entity.OrderStatus;
import com.yeahyak.backend.domain.order.service.OrderService;
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
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 발주 생성
    @PreAuthorize("hasRole('PHARMACY')")
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid OrderCreateRequest request) {
        orderService.createOrder(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 발주 취소
    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long orderId) {
        orderService.cancelOrder(orderId, userDetails.getId(), userDetails.getRole());
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 발주 처리
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{orderId}/process")
    public ResponseEntity<ApiResponse<Void>> processOrder(
            @PathVariable Long orderId) {
        orderService.processOrder(orderId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 발주 완료
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{orderId}/complete")
    public ResponseEntity<ApiResponse<Void>> completeOrder(
            @PathVariable Long orderId) {
        orderService.completeOrder(orderId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 발주 통계 조회
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<OrderStatisticsResponse>> getOrderStatistics() {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.getOrderStatistics()));
    }

    // 발주 목록 조회 (약국)
    @PreAuthorize("hasRole('PHARMACY')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PageResponse<PharmacyOrderListResponse>>> getMyOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) LocalDateTime start,
            @RequestParam(required = false) LocalDateTime end,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.getOrdersByUserId(userDetails.getId(), status, start, end, pageable)));
    }

    // 발주 목록 조회 (어드민)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminOrderListResponse>>> getOrders(
            @RequestParam(required = false) PharmacyRegion region,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) LocalDateTime start,
            @RequestParam(required = false) LocalDateTime end,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.getOrders(region, status, start, end, pageable)));
    }

    // 주문 상세 조회
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.getOrder(orderId, userDetails.getId(), userDetails.getRole())));
    }

    // 반품 가능 수량 조회 (약국)
    @PreAuthorize("hasRole('PHARMACY')")
    @GetMapping("/{orderId}/returnable")
    public ResponseEntity<ApiResponse<ReturnableOrderResponse>> getReturnableOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok(
                orderService.getReturnableOrder(userDetails.getId(), orderId)));
    }
}
