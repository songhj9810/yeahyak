package com.yeahyak.backend.domain.user.dto.response;

import com.yeahyak.backend.domain.user.entity.Admin;
import com.yeahyak.backend.domain.user.entity.AdminDepartment;
import com.yeahyak.backend.domain.user.entity.User;

import java.time.LocalDateTime;

public record AdminResponse(
        Long id,
        String email,
        String employeeId,
        String name,
        AdminDepartment department,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public static AdminResponse from(Admin admin) {
        User user = admin.getUser();
        return new AdminResponse(
                admin.getId(),
                user.getEmail(), // Admin → User → email
                admin.getEmployeeId(),
                admin.getName(),
                admin.getDepartment(),
                admin.getCreatedAt(),
                admin.getUpdatedAt());
    }
}
