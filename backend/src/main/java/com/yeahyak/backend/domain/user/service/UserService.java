package com.yeahyak.backend.domain.user.service;

import com.yeahyak.backend.domain.user.dto.request.AdminUpdateRequest;
import com.yeahyak.backend.domain.user.dto.request.PharmacyUpdateRequest;
import com.yeahyak.backend.domain.user.dto.response.AdminResponse;
import com.yeahyak.backend.domain.user.dto.response.PharmacyListResponse;
import com.yeahyak.backend.domain.user.dto.response.PharmacyResponse;
import com.yeahyak.backend.domain.user.entity.Admin;
import com.yeahyak.backend.domain.user.entity.Pharmacy;
import com.yeahyak.backend.domain.user.entity.PharmacyRegion;
import com.yeahyak.backend.domain.user.repository.AdminRepository;
import com.yeahyak.backend.domain.user.repository.PharmacyRepository;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import com.yeahyak.backend.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final AdminRepository adminRepository;
    private final PharmacyRepository pharmacyRepository;

    // 어드민 본인 조회
    public AdminResponse getAdmin(Long userId) {
        Admin admin = adminRepository.findByUserIdWithUser(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ADMIN_NOT_FOUND));
        return AdminResponse.from(admin);
    }

    // 어드민 본인 수정
    @Transactional
    public void updateAdmin(Long userId, AdminUpdateRequest request) {
        Admin admin = adminRepository.findByUserIdWithUser(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ADMIN_NOT_FOUND));
        admin.update(
                request.newName(),
                request.newDepartment());
    }

    // 약국 본인 조회
    public PharmacyResponse getPharmacyByUserId(Long userId) {
        Pharmacy pharmacy = pharmacyRepository.findByUserIdWithUserAndWallet(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
        return PharmacyResponse.from(pharmacy);
    }

    // 약국 본인 수정
    @Transactional
    public void updatePharmacy(Long userId, PharmacyUpdateRequest request) {
        Pharmacy pharmacy = pharmacyRepository.findByUserIdWithUserAndWallet(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
        pharmacy.update(
                request.newRepresentative(),
                request.newName(),
                request.newPostcode(),
                request.newAddress(),
                request.newAddressDetails(),
                request.newRegion(),
                request.newContact());
    }

    // 약국 목록 조회 (어드민)
    public PageResponse<PharmacyListResponse> getPharmacies(PharmacyRegion region,
                                                            boolean lowBalance,
                                                            String keyword,
                                                            Pageable pageable) {
        return PageResponse.from(
                pharmacyRepository.searchPharmacies(region, lowBalance, keyword, pageable)
                        .map(PharmacyListResponse::from));
    }

    // 약국 상세 조회 (어드민)
    public PharmacyResponse getPharmacy(Long pharmacyId) {
        Pharmacy pharmacy = pharmacyRepository.findByIdWithUserAndWallet(pharmacyId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
        return PharmacyResponse.from(pharmacy);
    }
}
