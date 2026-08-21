package com.yeahyak.backend.domain.notice.dto.request;

import com.yeahyak.backend.domain.notice.entity.NoticeCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NoticeCreateRequest(
        @NotNull NoticeCategory category,
        @NotBlank String title,
        @NotBlank String content) {
}
