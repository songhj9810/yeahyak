package com.yeahyak.backend.domain.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PasswordResetMailRequest(
        @NotBlank @Email String email) {
}
