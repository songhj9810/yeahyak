package com.yeahyak.backend.domain.notice.entity;

import com.yeahyak.backend.domain.user.entity.Admin;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notices")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NoticeCategory category;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @OneToMany(mappedBy = "notice", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Attachment> attachments = new ArrayList<>();

    @Builder
    private Notice(NoticeCategory category, String title, String content, Admin admin) {
        this.category = category;
        this.title = title;
        this.content = content;
        this.admin = admin;
    }

    public static Notice create(NoticeCategory category, String title, String content, Admin admin) {
        return Notice.builder()
                .category(category)
                .title(title)
                .content(content)
                .admin(admin)
                .build();
    }

    public void updateNotice(String newTitle, String newContent) {
        if (newTitle != null) this.title = newTitle;
        if (newContent != null) this.content = newContent;
    }
}
