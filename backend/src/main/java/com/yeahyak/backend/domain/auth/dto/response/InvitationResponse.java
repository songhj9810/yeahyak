package com.yeahyak.backend.domain.auth.dto.response;

import com.yeahyak.backend.domain.auth.entity.Invitation;
import com.yeahyak.backend.domain.auth.entity.InvitationStatus;
import com.yeahyak.backend.domain.user.entity.Admin;
import com.yeahyak.backend.domain.user.entity.UserRole;

import java.time.LocalDateTime;

public record InvitationResponse(
        Long id,
        String email,
        UserRole role,
        InvitationStatus status,
        LocalDateTime createdAt,
        LocalDateTime expiresAt,
        String adminEmployeeId,
        String adminName) {
    public static InvitationResponse from(Invitation invitation) {
        Admin admin = invitation.getAdmin();
        return new InvitationResponse(
                invitation.getId(),
                invitation.getEmail(),
                invitation.getRole(),
                invitation.getStatus(),
                invitation.getCreatedAt(),
                invitation.getExpiresAt(),
                admin.getEmployeeId(), // Invitation → Admin → employeeId
                admin.getName()); // Invitation → Admin → name
    }
}
