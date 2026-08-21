package com.yeahyak.backend.domain.notice.dto.response;

import com.yeahyak.backend.domain.notice.entity.Attachment;
import com.yeahyak.backend.domain.notice.entity.Notice;
import com.yeahyak.backend.domain.notice.entity.NoticeCategory;
import com.yeahyak.backend.domain.user.entity.Admin;

import java.time.LocalDateTime;
import java.util.List;

public record NoticeResponse(
        Long id,
        NoticeCategory category,
        String title,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long adminId,
        String adminName,
        List<AttachmentResponse> attachments) {
    public static NoticeResponse from(Notice notice) {
        Admin admin = notice.getAdmin();
        return new NoticeResponse(
                notice.getId(),
                notice.getCategory(),
                notice.getTitle(),
                notice.getContent(),
                notice.getCreatedAt(),
                notice.getUpdatedAt(),
                admin.getId(),
                admin.getName(),
                notice.getAttachments().stream().map(AttachmentResponse::from).toList()
        );
    }

    public record AttachmentResponse(
            Long id,
            String fileName,
            String filePath,
            Long fileSize,
            String fileType) {
        public static AttachmentResponse from(Attachment attachment) {
            return new AttachmentResponse(
                    attachment.getId(),
                    attachment.getFileName(),
                    attachment.getFilePath(),
                    attachment.getFileSize(),
                    attachment.getFileType());
        }
    }
}
