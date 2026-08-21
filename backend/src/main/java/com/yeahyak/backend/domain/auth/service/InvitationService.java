package com.yeahyak.backend.domain.auth.service;

import com.yeahyak.backend.domain.auth.dto.request.AdminSignupRequest;
import com.yeahyak.backend.domain.auth.dto.request.InvitationCreateRequest;
import com.yeahyak.backend.domain.auth.dto.request.PharmacySignupRequest;
import com.yeahyak.backend.domain.auth.dto.response.InvitationResponse;
import com.yeahyak.backend.domain.auth.dto.response.InvitationValidateResponse;
import com.yeahyak.backend.domain.auth.entity.Invitation;
import com.yeahyak.backend.domain.auth.entity.InvitationStatus;
import com.yeahyak.backend.domain.auth.repository.InvitationRepository;
import com.yeahyak.backend.domain.user.entity.*;
import com.yeahyak.backend.domain.user.repository.AdminRepository;
import com.yeahyak.backend.domain.user.repository.PharmacyRepository;
import com.yeahyak.backend.domain.user.repository.UserRepository;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import com.yeahyak.backend.global.response.PageResponse;
import com.yeahyak.backend.global.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final AdminRepository adminRepository;
    private final PharmacyRepository pharmacyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    // 회원가입 초대 메일 생성 및 발송
    @Transactional
    public void invite(Long userId, InvitationCreateRequest request) {
        Admin admin = adminRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ADMIN_NOT_FOUND));
        if (admin.getDepartment() != AdminDepartment.MANAGEMENT) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        String token = UUID.randomUUID().toString();

        Invitation invitation = Invitation.create(
                token,
                request.email(),
                request.role(),
                LocalDateTime.now().plusDays(1),
                admin);
        invitationRepository.save(invitation);
        mailService.sendInvitationMail(request.email(), token);
    }

    // 회원가입 초대 메일 목록 조회
    public PageResponse<InvitationResponse> getInvitations(UserRole role,
                                                           InvitationStatus status,
                                                           Pageable pageable) {
        return PageResponse.from(
                invitationRepository.searchInvitations(role, status, pageable)
                        .map(InvitationResponse::from));
    }

    // 회원가입 초대 메일 검증 (회원가입 페이지 진입 시)
    public InvitationValidateResponse validate(String token) {
        Invitation invitation = getValidInvitation(token);
        return InvitationValidateResponse.from(invitation);
    }

    // 관리자 회원가입
    @Transactional
    public void signupAdmin(AdminSignupRequest request) {
        Invitation invitation = getValidInvitation(request.token());

        if (userRepository.existsByEmail(invitation.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (invitation.getRole() != UserRole.ADMIN) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        if (adminRepository.existsByEmployeeId(request.employeeId())) {
            throw new CustomException(ErrorCode.EMPLOYEE_ID_ALREADY_EXISTS);
        }

        User user = User.create(
                invitation.getEmail(),
                passwordEncoder.encode(request.password()),
                UserRole.ADMIN,
                invitation);
        userRepository.save(user);

        Admin admin = Admin.create(
                user,
                request.employeeId(),
                request.name(),
                request.department());
        adminRepository.save(admin);

        invitation.markAsUsed();
    }

    // 약국 회원가입
    @Transactional
    public void signupPharmacy(PharmacySignupRequest request) {
        Invitation invitation = getValidInvitation(request.token());

        if (userRepository.existsByEmail(invitation.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (invitation.getRole() != UserRole.PHARMACY) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        if (pharmacyRepository.existsByBrn(request.brn())) {
            throw new CustomException(ErrorCode.BRN_ALREADY_EXISTS);
        }

        User user = User.create(
                invitation.getEmail(),
                passwordEncoder.encode(request.password()),
                UserRole.PHARMACY,
                invitation);
        userRepository.save(user);

        Pharmacy pharmacy = Pharmacy.create(
                user,
                request.brn(),
                request.representative(),
                request.name(),
                request.postcode(),
                request.address(),
                request.addressDetails(),
                request.region(),
                request.contact());
        pharmacy.initWallet();
        pharmacyRepository.save(pharmacy);

        invitation.markAsUsed();
    }

    // 공통: 회원가입 초대 토큰 검증
    private Invitation getValidInvitation(String token) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));
        if (invitation.getStatus() == InvitationStatus.USED) {
            throw new CustomException(ErrorCode.INVITATION_ALREADY_USED);
        }
        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new CustomException(ErrorCode.EXPIRED_INVITATION);
        }
        return invitation;
    }
}
