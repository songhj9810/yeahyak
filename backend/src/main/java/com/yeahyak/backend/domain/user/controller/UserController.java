package com.yeahyak.backend.domain.user.controller;

import com.yeahyak.backend.domain.user.dto.request.AdminUpdateRequest;
import com.yeahyak.backend.domain.user.dto.request.PharmacyUpdateRequest;
import com.yeahyak.backend.domain.user.dto.response.AdminResponse;
import com.yeahyak.backend.domain.user.dto.response.PharmacyListResponse;
import com.yeahyak.backend.domain.user.dto.response.PharmacyResponse;
import com.yeahyak.backend.domain.user.entity.PharmacyRegion;
import com.yeahyak.backend.domain.user.service.UserService;
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

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 어드민 본인 조회
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admins/me")
    public ResponseEntity<ApiResponse<AdminResponse>> getAdmin(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(
                userService.getAdmin(userDetails.getId())));
    }

    // 어드민 본인 수정
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admins/me")
    public ResponseEntity<ApiResponse<Void>> updateAdmin(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid AdminUpdateRequest request) {
        userService.updateAdmin(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 약국 본인 조회
    @PreAuthorize("hasRole('PHARMACY')")
    @GetMapping("/pharmacies/me")
    public ResponseEntity<ApiResponse<PharmacyResponse>> getMyPharmacy(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(
                userService.getPharmacyByUserId(userDetails.getId())));
    }

    // 약국 본인 수정
    @PreAuthorize("hasRole('PHARMACY')")
    @PatchMapping("/pharmacies/me")
    public ResponseEntity<ApiResponse<Void>> updatePharmacy(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid PharmacyUpdateRequest request) {
        userService.updatePharmacy(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 약국 목록 조회 (어드민)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pharmacies")
    public ResponseEntity<ApiResponse<PageResponse<PharmacyListResponse>>> getPharmacies(
            @RequestParam(required = false) PharmacyRegion region,
            @RequestParam(required = false, defaultValue = "false") boolean lowBalance,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                userService.getPharmacies(region, lowBalance, keyword, pageable)));
    }

    // 약국 상세 조회 (어드민)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pharmacies/{pharmacyId}")
    public ResponseEntity<ApiResponse<PharmacyResponse>> getPharmacy(
            @PathVariable Long pharmacyId) {
        return ResponseEntity.ok(ApiResponse.ok(
                userService.getPharmacy(pharmacyId)));
    }
}
