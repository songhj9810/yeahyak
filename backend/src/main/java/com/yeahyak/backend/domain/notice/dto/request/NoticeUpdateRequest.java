package com.yeahyak.backend.domain.notice.dto.request;

import java.util.List;

public record NoticeUpdateRequest(
        String newTitle,
        String newContent,
        List<Long> attachmentIdsToDelete) {
}
