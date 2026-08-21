package com.yeahyak.backend.domain.notice.dto.response;

import com.yeahyak.backend.domain.notice.entity.Notice;
import com.yeahyak.backend.domain.notice.entity.NoticeCategory;
import com.yeahyak.backend.domain.user.entity.Admin;

import java.time.LocalDateTime;

public record NoticeListResponse(
        Long id,
        NoticeCategory category,
        String title,
        LocalDateTime createdAt,
        String adminName) {
    public static NoticeListResponse from(Notice notice) {
        Admin admin = notice.getAdmin();
        return new NoticeListResponse(
                notice.getId(),
                notice.getCategory(),
                notice.getTitle(),
                notice.getCreatedAt(),
                admin.getName()); // Notice → Admin → name
    }
}
