package com.yeahyak.backend.domain.forecast.controller;

import com.yeahyak.backend.domain.forecast.dto.request.ForecastRequest;
import com.yeahyak.backend.domain.forecast.dto.response.ForecastResponse;
import com.yeahyak.backend.domain.forecast.dto.response.LastSalesUploadResponse;
import com.yeahyak.backend.domain.forecast.service.ForecastService;
import com.yeahyak.backend.global.response.ApiResponse;
import com.yeahyak.backend.global.security.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forecast")
@RequiredArgsConstructor
public class ForecastController {

    private final ForecastService forecastService;

    // 마지막 판매 데이터 업로드 날짜 조회
    @GetMapping("/last-sales-upload")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<ApiResponse<LastSalesUploadResponse>> getLastSalesUpload(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(
                forecastService.getLastSalesUpload(userDetails.getId())));
    }

    // 발주 추천
    @PostMapping
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<ApiResponse<List<ForecastResponse>>> forecast(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid ForecastRequest request,
            HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        return ResponseEntity.ok(ApiResponse.ok(
                forecastService.forecast(userDetails.getId(), request, token)));
    }
}
