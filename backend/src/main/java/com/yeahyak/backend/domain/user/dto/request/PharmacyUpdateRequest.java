package com.yeahyak.backend.domain.user.dto.request;

import com.yeahyak.backend.domain.user.entity.PharmacyRegion;
import jakarta.validation.constraints.Pattern;

public record PharmacyUpdateRequest(
        String newRepresentative,
        String newName,
        String newPostcode,
        String newAddress,
        String newAddressDetails,
        PharmacyRegion newRegion,
        @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$") String newContact) {
}
