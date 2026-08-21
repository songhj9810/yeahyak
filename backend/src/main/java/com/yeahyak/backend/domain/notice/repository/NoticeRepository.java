package com.yeahyak.backend.domain.notice.repository;

import com.yeahyak.backend.domain.notice.entity.Notice;
import com.yeahyak.backend.domain.notice.entity.NoticeCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    // 공지사항 상세 조회
    @Query("""
            SELECT n FROM Notice n
            JOIN FETCH n.admin
            LEFT JOIN FETCH n.attachments
            WHERE n.id = :id
            """)
    Optional<Notice> findByIdWithAttachments(@Param("id") Long id);

    // 공지사항 목록 조회
    @Query(value = """
            SELECT n FROM Notice n
            JOIN FETCH n.admin
            WHERE (n.category = :category)
              AND (:keyword IS NULL
               OR (:filter = 'TITLE' AND n.title LIKE %:keyword%)
               OR (:filter = 'CONTENT' AND n.content LIKE %:keyword%)
               OR (:filter = 'BOTH' AND (n.title LIKE %:keyword% OR n.content LIKE %:keyword%)))
            """,
            countQuery = """
                    SELECT COUNT(n) FROM Notice n
                    WHERE (n.category = :category)
                      AND (:keyword IS NULL
                       OR (:filter = 'TITLE' AND n.title LIKE %:keyword%)
                       OR (:filter = 'CONTENT' AND n.content LIKE %:keyword%)
                       OR (:filter = 'BOTH' AND (n.title LIKE %:keyword% OR n.content LIKE %:keyword%)))
                    """)
    Page<Notice> searchNotices(@Param("category") NoticeCategory category,
                               @Param("keyword") String keyword,
                               @Param("filter") String filter,
                               Pageable pageable);

    // 공지사항 최신순 5개
    List<Notice> findTop5ByOrderByCreatedAtDesc();
}
