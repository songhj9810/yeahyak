package com.yeahyak.backend.domain.wallet.entity;

public enum WalletEvent {
    DEDUCT, // 발주 생성 시
    REFUND, // 반품 완료 시
    CANCEL, // 발주 반려/취소 시
    SETTLE // 정산 처리 시
}
