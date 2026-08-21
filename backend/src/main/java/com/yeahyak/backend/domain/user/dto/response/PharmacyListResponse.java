package com.yeahyak.backend.domain.user.dto.response;

import com.yeahyak.backend.domain.user.entity.Pharmacy;
import com.yeahyak.backend.domain.user.entity.PharmacyRegion;
import com.yeahyak.backend.domain.wallet.entity.Wallet;

import java.time.LocalDateTime;

public record PharmacyListResponse(
        Long id,
        String name,
        String address,
        PharmacyRegion region,
        String contact,
        Integer balance,
        Integer quota,
        LocalDateTime lastSettledAt) {
    public static PharmacyListResponse from(Pharmacy pharmacy) {
        Wallet wallet = pharmacy.getWallet();
        return new PharmacyListResponse(
                pharmacy.getId(),
                pharmacy.getName(),
                pharmacy.getAddress(),
                pharmacy.getRegion(),
                pharmacy.getContact(),
                wallet.getBalance(), // Pharmacy → Wallet → balance
                wallet.getQuota(), // Pharmacy → Wallet → quota
                wallet.getLastSettledAt()); // Pharmacy → Wallet → lastSettledAt
    }
}
