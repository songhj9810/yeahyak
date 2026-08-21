package com.yeahyak.backend.domain.wallet.entity;

import com.yeahyak.backend.domain.user.entity.Pharmacy;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "wallets")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacy_id", nullable = false, unique = true)
    private Pharmacy pharmacy;

    @Column(nullable = false)
    private Integer balance;

    @Column(nullable = false)
    private Integer quota;

    private LocalDateTime lastSettledAt;

    @Builder
    private Wallet(Pharmacy pharmacy, Integer balance, Integer quota) {
        this.pharmacy = pharmacy;
        this.balance = balance;
        this.quota = quota;
    }

    public static Wallet create(Pharmacy pharmacy) {
        return Wallet.builder()
                .pharmacy(pharmacy)
                .balance(0)
                .quota(0)
                .build();
    }

    public void updateQuota(int newQuota) {
        this.quota = newQuota;
    }

    // 발주 생성 시 잔액 차감
    public WalletTx deduct(Integer amount, Long orderId) {
        if (this.balance < amount) {
            throw new CustomException(ErrorCode.INSUFFICIENT_BALANCE);
        }
        Integer before = this.balance;
        this.balance -= amount;
        return WalletTx.create(this, WalletEvent.DEDUCT, amount, before, this.balance, orderId, null);
    }

    // 발주 취소 시 잔액 복구
    public WalletTx cancel(Integer amount, Long orderId) {
        Integer before = this.balance;
        this.balance += amount;
        return WalletTx.create(this, WalletEvent.CANCEL, amount, before, this.balance, orderId, null);
    }

    // 반품 완료 시 잔액 복구
    public WalletTx refund(Integer amount, Long returnOrderId) {
        Integer before = this.balance;
        this.balance += amount;
        return WalletTx.create(this, WalletEvent.REFUND, amount, before, this.balance, null, returnOrderId);
    }

    // 정산 처리 시 잔액을 한도만큼 채움
    public WalletTx settle() {
        if (this.balance >= this.quota) {
            throw new CustomException(ErrorCode.UNPROCESSABLE_ENTITY);
        }
        Integer before = this.balance;
        Integer amount = this.quota - this.balance;
        this.balance = this.quota;
        this.lastSettledAt = LocalDateTime.now();
        return WalletTx.create(this, WalletEvent.SETTLE, amount, before, this.balance, null, null);
    }
}
