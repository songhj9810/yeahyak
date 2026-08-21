package com.yeahyak.backend.domain.wallet.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_tx")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class WalletTx {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WalletEvent event;

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false)
    private Integer balanceBefore;

    @Column(nullable = false)
    private Integer balanceAfter;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private Long orderId;

    private Long returnOrderId;

    @Builder
    private WalletTx(Wallet wallet, WalletEvent event, Integer amount,
                     Integer balanceBefore, Integer balanceAfter,
                     Long orderId, Long returnOrderId) {
        this.wallet = wallet;
        this.event = event;
        this.amount = amount;
        this.balanceBefore = balanceBefore;
        this.balanceAfter = balanceAfter;
        this.orderId = orderId;
        this.returnOrderId = returnOrderId;
    }

    public static WalletTx create(Wallet wallet, WalletEvent event, Integer amount,
                                  Integer balanceBefore, Integer balanceAfter,
                                  Long orderId, Long returnOrderId) {
        return WalletTx.builder()
                .wallet(wallet)
                .event(event)
                .amount(amount)
                .balanceBefore(balanceBefore)
                .balanceAfter(balanceAfter)
                .orderId(orderId)
                .returnOrderId(returnOrderId)
                .build();
    }
}
