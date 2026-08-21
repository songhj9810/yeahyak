package com.yeahyak.backend.domain.wallet.service;

import com.yeahyak.backend.domain.wallet.dto.request.QuotaResetRequest;
import com.yeahyak.backend.domain.wallet.dto.response.WalletResponse;
import com.yeahyak.backend.domain.wallet.dto.response.WalletTxResponse;
import com.yeahyak.backend.domain.wallet.entity.Wallet;
import com.yeahyak.backend.domain.wallet.entity.WalletEvent;
import com.yeahyak.backend.domain.wallet.entity.WalletTx;
import com.yeahyak.backend.domain.wallet.repository.WalletRepository;
import com.yeahyak.backend.domain.wallet.repository.WalletTxRepository;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import com.yeahyak.backend.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTxRepository walletTxRepository;

    // 한도 재설정
    @Transactional
    public void updateQuota(Long pharmacyId, QuotaResetRequest request) {
        Wallet wallet = walletRepository.findByPharmacyIdWithLock(pharmacyId)
                .orElseThrow(() -> new CustomException(ErrorCode.WALLET_NOT_FOUND));
        wallet.updateQuota(request.newQuota());
    }

    // 잔액 차감
    @Transactional
    public void deduct(Long pharmacyId, Integer amount, Long orderId) {
        Wallet wallet = walletRepository.findByPharmacyIdWithLock(pharmacyId)
                .orElseThrow(() -> new CustomException(ErrorCode.WALLET_NOT_FOUND));
        WalletTx tx = wallet.deduct(amount, orderId);
        walletTxRepository.save(tx);
    }

    // 잔액 복구 (발주 취소)
    @Transactional
    public void cancel(Long pharmacyId, Integer amount, Long orderId) {
        Wallet wallet = walletRepository.findByPharmacyIdWithLock(pharmacyId)
                .orElseThrow(() -> new CustomException(ErrorCode.WALLET_NOT_FOUND));
        WalletTx tx = wallet.cancel(amount, orderId);
        walletTxRepository.save(tx);
    }

    // 잔액 복구 (반품 완료)
    @Transactional
    public void refund(Long pharmacyId, Integer amount, Long returnOrderId) {
        Wallet wallet = walletRepository.findByPharmacyIdWithLock(pharmacyId)
                .orElseThrow(() -> new CustomException(ErrorCode.WALLET_NOT_FOUND));
        WalletTx tx = wallet.refund(amount, returnOrderId);
        walletTxRepository.save(tx);
    }

    // 정산
    @Transactional
    public void settle(Long pharmacyId) {
        Wallet wallet = walletRepository.findByPharmacyIdWithLock(pharmacyId)
                .orElseThrow(() -> new CustomException(ErrorCode.WALLET_NOT_FOUND));
        WalletTx tx = wallet.settle();
        walletTxRepository.save(tx);
    }

    // 잔액 조회 (어드민)
    public WalletResponse getWallet(Long pharmacyId) {
        Wallet wallet = walletRepository.findByPharmacyId(pharmacyId)
                .orElseThrow(() -> new CustomException(ErrorCode.WALLET_NOT_FOUND));
        return WalletResponse.from(wallet);
    }

    // 거래 내역 조회 (어드민)
    public PageResponse<WalletTxResponse> getWalletTxs(Long pharmacyId,
                                                       WalletEvent event,
                                                       LocalDateTime start,
                                                       LocalDateTime end,
                                                       Pageable pageable) {
        Wallet wallet = walletRepository.findByPharmacyId(pharmacyId)
                .orElseThrow(() -> new CustomException(ErrorCode.WALLET_NOT_FOUND));
        return PageResponse.from(
                walletTxRepository.searchWalletTxs(wallet.getId(), event, start, end, pageable)
                        .map(WalletTxResponse::from));
    }

    // 잔액 조회 (약국)
    public WalletResponse getWalletByUserId(Long userId) {
        Wallet wallet = walletRepository.findByPharmacyUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.WALLET_NOT_FOUND));
        return WalletResponse.from(wallet);
    }

    // 거래 내역 조회 (약국)
    public PageResponse<WalletTxResponse> getWalletTxsByUserId(Long userId,
                                                               WalletEvent event,
                                                               LocalDateTime start,
                                                               LocalDateTime end,
                                                               Pageable pageable) {
        Wallet wallet = walletRepository.findByPharmacyUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.WALLET_NOT_FOUND));
        return PageResponse.from(
                walletTxRepository.searchWalletTxs(wallet.getId(), event, start, end, pageable)
                        .map(WalletTxResponse::from));
    }
}
