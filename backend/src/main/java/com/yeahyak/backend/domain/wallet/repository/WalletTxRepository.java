package com.yeahyak.backend.domain.wallet.repository;

import com.yeahyak.backend.domain.wallet.entity.WalletEvent;
import com.yeahyak.backend.domain.wallet.entity.WalletTx;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface WalletTxRepository extends JpaRepository<WalletTx, Long> {
    @Query("""
            SELECT t FROM WalletTx t
            WHERE (t.wallet.id = :walletId)
              AND (:event IS NULL OR t.event = :event)
              AND (:start IS NULL OR t.createdAt >= :start)
              AND (:end IS NULL OR t.createdAt <= :end)
            """)
    Page<WalletTx> searchWalletTxs(@Param("walletId") Long walletId,
                                   @Param("event") WalletEvent event,
                                   @Param("start") LocalDateTime start,
                                   @Param("end") LocalDateTime end,
                                   Pageable pageable);
}
