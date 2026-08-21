package com.yeahyak.backend.domain.auth.dto.request;

import com.yeahyak.backend.domain.user.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InvitationCreateRequest(
        @NotBlank @Email String email,
        @NotNull UserRole role) {
}
