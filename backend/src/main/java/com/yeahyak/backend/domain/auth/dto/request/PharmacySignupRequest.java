package com.yeahyak.backend.domain.auth.dto.request;

import com.yeahyak.backend.domain.user.entity.PharmacyRegion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record PharmacySignupRequest(
        @NotBlank String token,
        @NotBlank @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$") String password,
        @NotBlank @Pattern(regexp = "^\\d{3}-\\d{2}-\\d{5}$") String brn,
        @NotBlank String representative,
        @NotBlank String name,
        @NotBlank String postcode,
        @NotBlank String address,
        String addressDetails,
        @NotNull PharmacyRegion region,
        @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$") String contact) {
}
