package com.yeahyak.backend.domain.auth.dto.response;

import com.yeahyak.backend.domain.auth.entity.Invitation;
import com.yeahyak.backend.domain.user.entity.UserRole;

public record InvitationValidateResponse(
        String email,
        UserRole role) {
    public static InvitationValidateResponse from(Invitation invitation) {
        return new InvitationValidateResponse(
                invitation.getEmail(),
                invitation.getRole());
    }
}
