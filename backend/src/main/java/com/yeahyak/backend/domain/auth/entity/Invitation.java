package com.yeahyak.backend.domain.auth.entity;

import com.yeahyak.backend.domain.user.entity.Admin;
import com.yeahyak.backend.domain.user.entity.UserRole;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvitationStatus status;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @Builder
    private Invitation(String token, String email, UserRole role, InvitationStatus status,
                       LocalDateTime expiresAt, Admin admin) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.status = status;
        this.expiresAt = expiresAt;
        this.admin = admin;
    }

    public static Invitation create(String token, String email, UserRole role, LocalDateTime expiresAt, Admin admin) {
        return Invitation.builder()
                .token(token)
                .email(email)
                .role(role)
                .status(InvitationStatus.PENDING)
                .expiresAt(expiresAt)
                .admin(admin)
                .build();
    }

    public void markAsUsed() {
        this.status = InvitationStatus.USED;
    }
}
