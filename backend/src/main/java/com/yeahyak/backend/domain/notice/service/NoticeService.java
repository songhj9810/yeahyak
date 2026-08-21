package com.yeahyak.backend.domain.notice.service;

import com.yeahyak.backend.domain.notice.dto.request.NoticeCreateRequest;
import com.yeahyak.backend.domain.notice.dto.request.NoticeUpdateRequest;
import com.yeahyak.backend.domain.notice.dto.response.NoticeCreateResponse;
import com.yeahyak.backend.domain.notice.dto.response.NoticeListResponse;
import com.yeahyak.backend.domain.notice.dto.response.NoticeResponse;
import com.yeahyak.backend.domain.notice.entity.Attachment;
import com.yeahyak.backend.domain.notice.entity.Notice;
import com.yeahyak.backend.domain.notice.entity.NoticeCategory;
import com.yeahyak.backend.domain.notice.repository.AttachmentRepository;
import com.yeahyak.backend.domain.notice.repository.NoticeRepository;
import com.yeahyak.backend.domain.user.entity.Admin;
import com.yeahyak.backend.domain.user.repository.AdminRepository;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import com.yeahyak.backend.global.response.PageResponse;
import com.yeahyak.backend.global.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final AttachmentRepository attachmentRepository;
    private final AdminRepository adminRepository;
    private final S3Service s3Service;

    // 공지사항 등록
    @Transactional
    public NoticeCreateResponse createNotice(Long userId, NoticeCreateRequest request, List<MultipartFile> files) {
        Admin admin = adminRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ADMIN_NOT_FOUND));

        Notice notice = Notice.create(request.category(), request.title(), request.content(), admin);
        noticeRepository.save(notice);

        if (files != null && !files.isEmpty()) {
            uploadAttachments(notice, files);
        }

        return new NoticeCreateResponse(notice.getId());
    }

    // 공지사항 수정
    @Transactional
    public void updateNotice(Long noticeId, NoticeUpdateRequest request, List<MultipartFile> files) {
        Notice notice = noticeRepository.findByIdWithAttachments(noticeId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTICE_NOT_FOUND));

        notice.updateNotice(
                request.newTitle(),
                request.newContent());

        // 첨부파일 삭제
        if (request.attachmentIdsToDelete() != null && !request.attachmentIdsToDelete().isEmpty()) {
            List<Attachment> toDelete = notice.getAttachments().stream()
                    .filter(a -> request.attachmentIdsToDelete().contains(a.getId()))
                    .toList();
            toDelete.forEach(a -> s3Service.delete(a.getFileKey()));
            attachmentRepository.deleteAll(toDelete);
        }

        // 새 첨부파일 추가
        if (files != null && !files.isEmpty()) {
            uploadAttachments(notice, files);
        }
    }

    // 공지사항 삭제
    @Transactional
    public void deleteNotice(Long noticeId) {
        Notice notice = noticeRepository.findByIdWithAttachments(noticeId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTICE_NOT_FOUND));

        notice.getAttachments().forEach(a -> s3Service.delete(a.getFileKey()));
        noticeRepository.delete(notice);
    }

    // 최신 공지사항 5개 조회
    public List<NoticeListResponse> getLatestNotices() {
        return noticeRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(NoticeListResponse::from)
                .toList();
    }

    // 공지사항 목록 조회
    public PageResponse<NoticeListResponse> getNotices(NoticeCategory category,
                                                       String keyword,
                                                       String filter,
                                                       Pageable pageable) {
        return PageResponse.from(
                noticeRepository.searchNotices(category, keyword, filter, pageable)
                        .map(NoticeListResponse::from));
    }

    // 공지사항 상세 조회
    public NoticeResponse getNotice(Long noticeId) {
        Notice notice = noticeRepository.findByIdWithAttachments(noticeId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTICE_NOT_FOUND));
        return NoticeResponse.from(notice);
    }

    // 공통: 첨부파일 업로드
    private void uploadAttachments(Notice notice, List<MultipartFile> files) {
        List<Attachment> attachments = files.stream()
                .map(file -> {
                    String[] uploaded = s3Service.upload(file, "notices");
                    return Attachment.create(
                            notice,
                            file.getOriginalFilename(),
                            uploaded[0],
                            uploaded[1],
                            file.getSize(),
                            file.getContentType());
                })
                .toList();
        attachmentRepository.saveAll(attachments);
    }
}
