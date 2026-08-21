package com.yeahyak.backend.domain.wallet.controller;

import com.yeahyak.backend.domain.wallet.dto.request.QuotaResetRequest;
import com.yeahyak.backend.domain.wallet.dto.response.WalletResponse;
import com.yeahyak.backend.domain.wallet.dto.response.WalletTxResponse;
import com.yeahyak.backend.domain.wallet.entity.WalletEvent;
import com.yeahyak.backend.domain.wallet.service.WalletService;
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
@RequestMapping("/api/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    // 한도 재설정
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{pharmacyId}/quota")
    public ResponseEntity<ApiResponse<Void>> resetQuota(
            @PathVariable Long pharmacyId,
            @RequestBody @Valid QuotaResetRequest request) {
        walletService.updateQuota(pharmacyId, request);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 정산
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{pharmacyId}/settle")
    public ResponseEntity<ApiResponse<Void>> settle(
            @PathVariable Long pharmacyId) {
        walletService.settle(pharmacyId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 잔액 조회 (어드민)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{pharmacyId}")
    public ResponseEntity<ApiResponse<WalletResponse>> getWallet(
            @PathVariable Long pharmacyId) {
        return ResponseEntity.ok(ApiResponse.ok(
                walletService.getWallet(pharmacyId)));
    }

    // 거래 내역 조회 (어드민)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{pharmacyId}/transactions")
    public ResponseEntity<ApiResponse<PageResponse<WalletTxResponse>>> getWalletTxs(
            @PathVariable Long pharmacyId,
            @RequestParam(required = false) WalletEvent event,
            @RequestParam(required = false) LocalDateTime start,
            @RequestParam(required = false) LocalDateTime end,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                walletService.getWalletTxs(pharmacyId, event, start, end, pageable)));
    }

    // 잔액 조회 (약국)
    @PreAuthorize("hasRole('PHARMACY')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<WalletResponse>> getMyWallet(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(
                walletService.getWalletByUserId(userDetails.getId())));
    }

    // 거래 내역 조회 (약국)
    @PreAuthorize("hasRole('PHARMACY')")
    @GetMapping("/me/transactions")
    public ResponseEntity<ApiResponse<PageResponse<WalletTxResponse>>> getMyWalletTxs(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) WalletEvent event,
            @RequestParam(required = false) LocalDateTime start,
            @RequestParam(required = false) LocalDateTime end,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                walletService.getWalletTxsByUserId(userDetails.getId(), event, start, end, pageable)));
    }
}
