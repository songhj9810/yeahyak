package com.yeahyak.backend.domain.auth.dto.response;

public record AuthTokens(
        String accessToken,
        String refreshToken) {
}
