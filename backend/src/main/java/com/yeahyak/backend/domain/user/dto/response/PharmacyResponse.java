package com.yeahyak.backend.domain.user.dto.response;

import com.yeahyak.backend.domain.user.entity.Pharmacy;
import com.yeahyak.backend.domain.user.entity.PharmacyRegion;
import com.yeahyak.backend.domain.user.entity.User;
import com.yeahyak.backend.domain.wallet.entity.Wallet;

import java.time.LocalDateTime;

public record PharmacyResponse(
        Long id,
        String email,
        String brn,
        String representative,
        String name,
        String postcode,
        String address,
        String addressDetails,
        PharmacyRegion region,
        String contact,
        Integer balance,
        Integer quota,
        LocalDateTime lastSettledAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public static PharmacyResponse from(Pharmacy pharmacy) {
        User user = pharmacy.getUser();
        Wallet wallet = pharmacy.getWallet();
        return new PharmacyResponse(
                pharmacy.getId(),
                user.getEmail(), // Pharmacy → User → email
                pharmacy.getBrn(),
                pharmacy.getRepresentative(),
                pharmacy.getName(),
                pharmacy.getPostcode(),
                pharmacy.getAddress(),
                pharmacy.getAddressDetails(),
                pharmacy.getRegion(),
                pharmacy.getContact(),
                wallet.getBalance(), // Pharmacy → Wallet → balance
                wallet.getQuota(), // Pharmacy → Wallet → quota
                wallet.getLastSettledAt(), // Pharmacy → Wallet → lastSettledAt
                pharmacy.getCreatedAt(),
                pharmacy.getUpdatedAt());
    }
}
