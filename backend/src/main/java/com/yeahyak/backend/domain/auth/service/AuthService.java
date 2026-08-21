package com.yeahyak.backend.domain.auth.service;

import com.yeahyak.backend.domain.auth.dto.request.LoginRequest;
import com.yeahyak.backend.domain.auth.dto.request.PasswordResetMailRequest;
import com.yeahyak.backend.domain.auth.dto.request.PasswordResetRequest;
import com.yeahyak.backend.domain.auth.dto.response.AuthTokens;
import com.yeahyak.backend.domain.user.entity.User;
import com.yeahyak.backend.domain.user.entity.UserRole;
import com.yeahyak.backend.domain.user.repository.UserRepository;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import com.yeahyak.backend.global.security.JwtProvider;
import com.yeahyak.backend.global.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final StringRedisTemplate redisTemplate;
    private final MailService mailService;

    // 관리자 로그인
    public AuthTokens loginAdmin(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_CREDENTIALS));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS);
        }
        if (!user.getRole().equals(UserRole.ADMIN)) {
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS);
        }
        return issueTokens(user);
    }

    // 약국 로그인
    public AuthTokens loginPharmacy(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_CREDENTIALS));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS);
        }
        if (!user.getRole().equals(UserRole.PHARMACY)) {
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS);
        }
        return issueTokens(user);
    }

    // 토큰 재발급
    public AuthTokens reissue(String refreshToken) {
        if (!jwtProvider.validateToken(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        Long userId = jwtProvider.getUserId(refreshToken);
        String stored = redisTemplate.opsForValue().get("REFRESH:" + userId);

        if (stored == null || !stored.equals(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // RTR: 기존 토큰 삭제 후 새로 발급
        // redisTemplate.delete("REFRESH:" + userId);
        return issueTokens(user);
    }

    // 로그아웃
    public void logout(Long userId) {
        redisTemplate.delete("REFRESH:" + userId);
    }

    // 비밀번호 재설정 메일 발송
    public void sendPasswordResetMail(PasswordResetMailRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String token = UUID.randomUUID().toString();

        redisTemplate.opsForValue().set(
                "PASSWORD_RESET:" + token,
                String.valueOf(user.getId()),
                10,
                TimeUnit.MINUTES);

        mailService.sendPasswordResetMail(request.email(), token);
    }

    // 비밀번호 재설정
    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        String userId = redisTemplate.opsForValue().get("PASSWORD_RESET:" + request.token());

        if (userId == null) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.SAME_AS_OLD_PASSWORD);
        }

        user.updatePassword(passwordEncoder.encode(request.newPassword()));
        redisTemplate.delete("PASSWORD_RESET:" + request.token());
    }

    // 공통: JWT 토큰 발급
    private AuthTokens issueTokens(User user) {
        String accessToken = jwtProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtProvider.generateRefreshToken(user.getId());

        redisTemplate.opsForValue().set(
                "REFRESH:" + user.getId(),
                refreshToken,
                jwtProvider.getRefreshExpiration(),
                TimeUnit.MILLISECONDS);

        return new AuthTokens(accessToken, refreshToken);
    }
}
