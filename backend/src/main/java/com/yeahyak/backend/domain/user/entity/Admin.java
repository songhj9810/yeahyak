package com.yeahyak.backend.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String employeeId;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdminDepartment department;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Builder
    private Admin(User user, String employeeId, String name, AdminDepartment department) {
        this.user = user;
        this.employeeId = employeeId;
        this.name = name;
        this.department = department;
    }

    public static Admin create(User user, String employeeId, String name, AdminDepartment department) {
        return Admin.builder()
                .user(user)
                .employeeId(employeeId)
                .name(name)
                .department(department)
                .build();
    }

    public void update(String newName, AdminDepartment newDepartment) {
        if (newName != null) this.name = newName;
        if (newDepartment != null) this.department = newDepartment;
    }
}
