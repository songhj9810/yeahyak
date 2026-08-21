package com.yeahyak.backend.domain.auth.controller;

import com.yeahyak.backend.domain.auth.dto.request.InvitationCreateRequest;
import com.yeahyak.backend.domain.auth.dto.response.InvitationResponse;
import com.yeahyak.backend.domain.auth.dto.response.InvitationValidateResponse;
import com.yeahyak.backend.domain.auth.entity.InvitationStatus;
import com.yeahyak.backend.domain.auth.service.InvitationService;
import com.yeahyak.backend.domain.user.entity.UserRole;
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
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    // 회원가입 초대 메일 생성 및 발송
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> invite(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid InvitationCreateRequest request) {
        invitationService.invite(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 초대 메일 목록 조회
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<InvitationResponse>>> getInvitations(
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) InvitationStatus status,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                invitationService.getInvitations(role, status, pageable)));
    }

    // 회원가입 초대 메일 검증 (회원가입 페이지 진입 시)
    @GetMapping("/{token}")
    public ResponseEntity<ApiResponse<InvitationValidateResponse>> validate(
            @PathVariable String token) {
        return ResponseEntity.ok(ApiResponse.ok(
                invitationService.validate(token)));
    }
}
