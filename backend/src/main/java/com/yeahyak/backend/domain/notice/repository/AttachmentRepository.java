package com.yeahyak.backend.domain.notice.repository;

import com.yeahyak.backend.domain.notice.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByNoticeId(Long noticeId);
}
