package com.yeahyak.backend.domain.user.entity;

import com.yeahyak.backend.domain.auth.entity.Invitation;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", unique = true)
    private Invitation invitation;

    @Builder
    private User(String email, String password, UserRole role, Invitation invitation) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.invitation = invitation;
    }

    public static User create(String email, String password, UserRole role, Invitation invitation) {
        return User.builder()
                .email(email)
                .password(password)
                .role(role)
                .invitation(invitation)
                .build();
    }

    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }
}
