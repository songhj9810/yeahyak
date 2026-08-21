package com.yeahyak.backend.domain.wallet.dto.response;

import com.yeahyak.backend.domain.wallet.entity.WalletEvent;
import com.yeahyak.backend.domain.wallet.entity.WalletTx;

import java.time.LocalDateTime;

public record WalletTxResponse(
        Long id,
        WalletEvent event,
        Integer amount,
        Integer balanceBefore,
        Integer balanceAfter,
        LocalDateTime createdAt,
        Long orderId,
        Long returnOrderId) {
    public static WalletTxResponse from(WalletTx walletTx) {
        return new WalletTxResponse(
                walletTx.getId(),
                walletTx.getEvent(),
                walletTx.getAmount(),
                walletTx.getBalanceBefore(),
                walletTx.getBalanceAfter(),
                walletTx.getCreatedAt(),
                walletTx.getOrderId(),
                walletTx.getReturnOrderId());
    }
}
