package com.yeahyak.backend.domain.auth.dto.response;

import com.yeahyak.backend.domain.user.entity.UserRole;

public record ReissueResponse(
        String accessToken,
        UserRole role) {
}
