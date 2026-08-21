package com.yeahyak.backend.domain.order.entity;

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
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    private OrderCanceledBy canceledBy;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacy_id", nullable = false)
    private Pharmacy pharmacy;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems = new ArrayList<>();

    @Builder
    private Order(OrderStatus status, Pharmacy pharmacy) {
        this.status = status;
        this.pharmacy = pharmacy;
    }

    public static Order create(Pharmacy pharmacy) {
        return Order.builder()
                .status(OrderStatus.PENDING)
                .pharmacy(pharmacy)
                .build();
    }

    public void cancel(OrderCanceledBy canceledBy) {
        if (this.status != OrderStatus.PENDING) {
            throw new CustomException(ErrorCode.ORDER_NOT_CANCELABLE);
        }
        this.status = OrderStatus.CANCELED;
        this.canceledBy = canceledBy;
    }

    public void process() {
        if (this.status != OrderStatus.PENDING) {
            throw new CustomException(ErrorCode.UNPROCESSABLE_ORDER);
        }
        this.status = OrderStatus.PROCESSING;
    }

    public void complete() {
        if (this.status != OrderStatus.PROCESSING) {
            throw new CustomException(ErrorCode.UNPROCESSABLE_ORDER);
        }
        this.status = OrderStatus.COMPLETED;
    }

    public Integer getTotalPrice() {
        return this.orderItems.stream().mapToInt(OrderItem::getTotalPrice).sum();
    }
}
