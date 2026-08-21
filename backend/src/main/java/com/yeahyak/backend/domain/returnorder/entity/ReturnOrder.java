package com.yeahyak.backend.domain.returnorder.entity;

import com.yeahyak.backend.domain.order.entity.Order;
import com.yeahyak.backend.domain.user.entity.Pharmacy;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "return_orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class ReturnOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private String returnReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReturnOrderStatus status;

    private String rejectReason;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacy_id", nullable = false)
    private Pharmacy pharmacy;

    @OneToMany(mappedBy = "returnOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ReturnOrderItem> returnOrderItems = new ArrayList<>();

    @Builder
    private ReturnOrder(Order order, String returnReason, ReturnOrderStatus status, Pharmacy pharmacy) {
        this.order = order;
        this.returnReason = returnReason;
        this.status = status;
        this.pharmacy = pharmacy;
    }

    public static ReturnOrder create(Order order, String returnReason) {
        return ReturnOrder.builder()
                .order(order)
                .returnReason(returnReason)
                .status(ReturnOrderStatus.PENDING)
                .pharmacy(order.getPharmacy())
                .build();
    }

    public void reject(String rejectReason) {
        if (this.status != ReturnOrderStatus.PENDING) {
            throw new CustomException(ErrorCode.UNPROCESSABLE_RETURN_ORDER);
        }
        this.status = ReturnOrderStatus.REJECTED;
        this.rejectReason = rejectReason;
    }

    public void approve() {
        if (this.status != ReturnOrderStatus.PENDING) {
            throw new CustomException(ErrorCode.UNPROCESSABLE_RETURN_ORDER);
        }
        this.status = ReturnOrderStatus.APPROVED;
    }

    public void process() {
        if (this.status != ReturnOrderStatus.APPROVED) {
            throw new CustomException(ErrorCode.UNPROCESSABLE_RETURN_ORDER);
        }
        this.status = ReturnOrderStatus.PROCESSING;
    }

    public void complete() {
        if (this.status != ReturnOrderStatus.PROCESSING) {
            throw new CustomException(ErrorCode.UNPROCESSABLE_RETURN_ORDER);
        }
        this.status = ReturnOrderStatus.COMPLETED;
    }

    public Integer getTotalPrice() {
        return this.returnOrderItems.stream().mapToInt(ReturnOrderItem::getTotalPrice).sum();
    }
}
