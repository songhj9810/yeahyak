package com.yeahyak.backend.domain.notice.controller;

import com.yeahyak.backend.domain.notice.dto.request.NoticeCreateRequest;
import com.yeahyak.backend.domain.notice.dto.request.NoticeUpdateRequest;
import com.yeahyak.backend.domain.notice.dto.response.NoticeCreateResponse;
import com.yeahyak.backend.domain.notice.dto.response.NoticeListResponse;
import com.yeahyak.backend.domain.notice.dto.response.NoticeResponse;
import com.yeahyak.backend.domain.notice.entity.NoticeCategory;
import com.yeahyak.backend.domain.notice.service.NoticeService;
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

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    // 공지사항 등록
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<NoticeCreateResponse>> createNotice(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart(value = "request") @Valid NoticeCreateRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        return ResponseEntity.ok(ApiResponse.ok(
                noticeService.createNotice(userDetails.getId(), request, files)));
    }

    // 공지사항 수정
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping(value = "/{noticeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> updateNotice(
            @PathVariable Long noticeId,
            @RequestPart(value = "request") @Valid NoticeUpdateRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        noticeService.updateNotice(noticeId, request, files);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 공지사항 삭제
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{noticeId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotice(
            @PathVariable Long noticeId) {
        noticeService.deleteNotice(noticeId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // 최신 공지사항 5개 조회
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<NoticeListResponse>>> getLatestNotices() {
        return ResponseEntity.ok(ApiResponse.ok(
                noticeService.getLatestNotices()));
    }

    // 공지사항 목록 조회
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<NoticeListResponse>>> getNotices(
            @RequestParam NoticeCategory category,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "BOTH") String filter,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                noticeService.getNotices(category, keyword, filter, pageable)));
    }

    // 공지사항 상세 조회
    @GetMapping("/{noticeId}")
    public ResponseEntity<ApiResponse<NoticeResponse>> getNotice(
            @PathVariable Long noticeId) {
        return ResponseEntity.ok(ApiResponse.ok(
                noticeService.getNotice(noticeId)));
    }
}
