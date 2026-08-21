package com.yeahyak.backend.domain.auth.controller;

import com.yeahyak.backend.domain.auth.dto.request.*;
import com.yeahyak.backend.domain.auth.dto.response.AuthTokens;
import com.yeahyak.backend.domain.auth.dto.response.LoginResponse;
import com.yeahyak.backend.domain.auth.dto.response.ReissueResponse;
import com.yeahyak.backend.domain.auth.service.AuthService;
import com.yeahyak.backend.domain.auth.service.InvitationService;
import com.yeahyak.backend.domain.user.entity.UserRole;
import com.yeahyak.backend.global.response.ApiResponse;
import com.yeahyak.backend.global.security.CustomUserDetails;
import com.yeahyak.backend.global.security.JwtProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final InvitationService invitationService;
    private final JwtProvider jwtProvider;

    // 관리자 로그인
    @PostMapping("/login/admin")
    public ResponseEntity<ApiResponse<LoginResponse>> loginAdmin(
            @RequestBody @Valid LoginRequest request) {
        AuthTokens authTokens = authService.loginAdmin(request);
        ResponseCookie cookie = buildRefreshCookie(
                authTokens.refreshToken(),
                jwtProvider.getRefreshExpiration() / 1000);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.ok(
                        new LoginResponse(authTokens.accessToken(), UserRole.ADMIN)));
    }

    // 약국 로그인
    @PostMapping("/login/pharmacy")
    public ResponseEntity<ApiResponse<LoginResponse>> loginPharmacy(
            @RequestBody @Valid LoginRequest request) {
        AuthTokens authTokens = authService.loginPharmacy(request);
        ResponseCookie cookie = buildRefreshCookie(
                authTokens.refreshToken(),
                jwtProvider.getRefreshExpiration() / 1000);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.ok(
                        new LoginResponse(authTokens.accessToken(), UserRole.PHARMACY)));
    }

    // 토큰 재발급
    @PostMapping("/reissue")
    public ResponseEntity<ApiResponse<ReissueResponse>> reissue(
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {
        AuthTokens authTokens = authService.reissue(refreshToken);
        ResponseCookie cookie = buildRefreshCookie(
                authTokens.refreshToken(),
                jwtProvider.getRefreshExpiration() / 1000);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.ok(
                        new ReissueResponse(authTokens.accessToken(), jwtProvider.getRole(authTokens.accessToken()))));
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        authService.logout(userDetails.getId());
        ResponseCookie cookie = buildRefreshCookie("", 0);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.ok());
    }

    // 비밀번호 재설정 메일 발송
    @PostMapping("/password")
    public ResponseEntity<ApiResponse<Void>> sendPasswordResetMail(
            @RequestBody @Valid PasswordResetMailRequest request) {
        authService.sendPasswordResetMail(request);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 비밀번호 재설정
    @PatchMapping("/password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @RequestBody @Valid PasswordResetRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 관리자 회원가입
    @PostMapping("/signup/admin")
    public ResponseEntity<ApiResponse<Void>> signupAdmin(
            @RequestBody @Valid AdminSignupRequest request) {
        invitationService.signupAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 약국 회원가입
    @PostMapping("/signup/pharmacy")
    public ResponseEntity<ApiResponse<Void>> signupPharmacy(
            @RequestBody @Valid PharmacySignupRequest request) {
        invitationService.signupPharmacy(request);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    private ResponseCookie buildRefreshCookie(String value, long maxAge) {
        return ResponseCookie.from("refreshToken", value)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAge)
                .build();
    }
}
