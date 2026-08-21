package com.yeahyak.backend.domain.wallet.dto.response;

import com.yeahyak.backend.domain.wallet.entity.Wallet;

import java.time.LocalDateTime;

public record WalletResponse(
        Long id,
        Integer balance,
        Integer quota,
        LocalDateTime lastSettledAt) {
    public static WalletResponse from(Wallet wallet) {
        return new WalletResponse(
                wallet.getId(),
                wallet.getBalance(),
                wallet.getQuota(),
                wallet.getLastSettledAt());
    }
}
