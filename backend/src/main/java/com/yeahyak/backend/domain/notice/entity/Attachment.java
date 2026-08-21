package com.yeahyak.backend.domain.notice.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "attachments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notice_id", nullable = false)
    private Notice notice;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String filePath;

    @Column(nullable = false)
    private String fileKey;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false)
    private String fileType;

    @Builder
    private Attachment(Notice notice, String fileName, String filePath,
                       String fileKey, Long fileSize, String fileType) {
        this.notice = notice;
        this.fileName = fileName;
        this.filePath = filePath;
        this.fileKey = fileKey;
        this.fileSize = fileSize;
        this.fileType = fileType;
    }

    public static Attachment create(Notice notice, String fileName, String filePath,
                                    String fileKey, Long fileSize, String fileType) {
        return Attachment.builder()
                .notice(notice)
                .fileName(fileName)
                .filePath(filePath)
                .fileKey(fileKey)
                .fileSize(fileSize)
                .fileType(fileType)
                .build();
    }
}
