package com.yeahyak.backend.domain.auth.dto.request;

import com.yeahyak.backend.domain.user.entity.AdminDepartment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record AdminSignupRequest(
        @NotBlank String token,
        @NotBlank @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$") String password,
        @NotBlank String employeeId,
        @NotBlank String name,
        @NotNull AdminDepartment department) {
}
