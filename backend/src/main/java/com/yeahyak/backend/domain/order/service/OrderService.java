package com.yeahyak.backend.domain.order.service;

import com.yeahyak.backend.domain.order.dto.request.OrderCreateRequest;
import com.yeahyak.backend.domain.order.dto.response.*;
import com.yeahyak.backend.domain.order.entity.Order;
import com.yeahyak.backend.domain.order.entity.OrderCanceledBy;
import com.yeahyak.backend.domain.order.entity.OrderItem;
import com.yeahyak.backend.domain.order.entity.OrderStatus;
import com.yeahyak.backend.domain.user.entity.UserRole;
import com.yeahyak.backend.domain.order.repository.OrderItemRepository;
import com.yeahyak.backend.domain.order.repository.OrderRepository;
import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.product.repository.ProductRepository;
import com.yeahyak.backend.domain.stock.service.HqStockService;
import com.yeahyak.backend.domain.stock.service.PharmacyStockService;
import com.yeahyak.backend.domain.user.entity.Pharmacy;
import com.yeahyak.backend.domain.user.entity.PharmacyRegion;
import com.yeahyak.backend.domain.user.repository.PharmacyRepository;
import com.yeahyak.backend.domain.wallet.service.WalletService;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import com.yeahyak.backend.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final PharmacyRepository pharmacyRepository;
    private final WalletService walletService;
    private final HqStockService hqStockService;
    private final PharmacyStockService pharmacyStockService;

    // 발주 생성
    @Transactional
    public void createOrder(Long userId, OrderCreateRequest request) {
        Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));

        Order order = Order.create(pharmacy);
        orderRepository.save(order);

        List<OrderItem> orderItems = request.orderItems().stream()
                .map(item -> {
                    Product product = productRepository.findById(item.productId())
                            .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));
                    return OrderItem.create(order, product, item.quantity());
                })
                .toList();
        orderItemRepository.saveAll(orderItems);

        // 본사 재고 출고
        for (OrderItem orderItem : orderItems) {
            hqStockService.orderOut(
                    orderItem.getProduct().getId(),
                    orderItem.getQuantity(),
                    orderItem.getId());
        }

        // 잔액 차감
        Integer totalPrice = orderItems.stream()
                .mapToInt(OrderItem::getTotalPrice)
                .sum();
        walletService.deduct(pharmacy.getId(), totalPrice, order.getId());
    }

    // 발주 취소
    @Transactional
    public void cancelOrder(Long orderId, Long userId, UserRole role) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));

        OrderCanceledBy canceledBy;
        if (role == UserRole.ADMIN) {
            canceledBy = OrderCanceledBy.HQ;
        } else {
            Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                    .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
            if (!order.getPharmacy().getId().equals(pharmacy.getId())) {
                throw new CustomException(ErrorCode.FORBIDDEN);
            }
            canceledBy = OrderCanceledBy.PHARMACY;
        }

        order.cancel(canceledBy);

        List<OrderItem> orderItems = orderItemRepository.findByOrderIdWithProduct(orderId);

        // 본사 재고 입고
        for (OrderItem orderItem : orderItems) {
            hqStockService.cancelIn(
                    orderItem.getProduct().getId(),
                    orderItem.getQuantity(),
                    orderItem.getId());
        }

        // 잔액 복구
        Integer totalPrice = orderItems.stream()
                .mapToInt(OrderItem::getTotalPrice)
                .sum();
        walletService.cancel(order.getPharmacy().getId(), totalPrice, order.getId());
    }

    // 발주 처리
    @Transactional
    public void processOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));
        order.process();
    }

    // 발주 완료
    @Transactional
    public void completeOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));
        order.complete();

        List<OrderItem> orderItems = orderItemRepository.findByOrderIdWithProduct(orderId);

        // 약국 재고 입고
        for (OrderItem orderItem : orderItems) {
            pharmacyStockService.orderIn(
                    order.getPharmacy().getId(),
                    orderItem.getProduct().getId(),
                    orderItem.getQuantity(),
                    orderItem.getId());
        }
    }

    // 발주 통계 조회
    public OrderStatisticsResponse getOrderStatistics() {
        LocalDateTime start = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = LocalDateTime.now().with(LocalTime.MAX);
        return new OrderStatisticsResponse(
                orderRepository.countByCreatedAtBetween(start, end),
                orderRepository.countByStatusAndCreatedAtBetween(OrderStatus.PROCESSING, start, end),
                orderRepository.countByStatusAndCreatedAtBetween(OrderStatus.COMPLETED, start, end),
                orderRepository.sumTotalPriceByCreatedAtBetween(start, end));
    }

    // 발주 목록 조회 (약국)
    public PageResponse<PharmacyOrderListResponse> getOrdersByUserId(Long userId,
                                                                     OrderStatus status,
                                                                     LocalDateTime start,
                                                                     LocalDateTime end,
                                                                     Pageable pageable) {
        return PageResponse.from(
                orderRepository.searchOrdersByPharmacy(userId, status, start, end, pageable)
                        .map(o -> PharmacyOrderListResponse.from(o, summarize(o))));
    }

    // 발주 목록 조회 (어드민)
    public PageResponse<AdminOrderListResponse> getOrders(PharmacyRegion region,
                                                          OrderStatus status,
                                                          LocalDateTime start,
                                                          LocalDateTime end,
                                                          Pageable pageable) {
        return PageResponse.from(
                orderRepository.searchOrdersByAdmin(region, status, start, end, pageable)
                        .map(o -> AdminOrderListResponse.from(o, summarize(o))));
    }

    // 발주 상세 조회
    public OrderResponse getOrder(Long orderId, Long userId, UserRole role) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));

        if (role == UserRole.PHARMACY) {
            Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                    .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
            if (!order.getPharmacy().getId().equals(pharmacy.getId())) {
                throw new CustomException(ErrorCode.FORBIDDEN);
            }
        }

        List<OrderItem> orderItems = orderItemRepository.findByOrderIdWithProduct(orderId);
        return OrderResponse.from(order, orderItems);
    }

    // 반품 가능 수량 조회 (약국)
    public ReturnableOrderResponse getReturnableOrder(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));
        Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
        if (!order.getPharmacy().getId().equals(pharmacy.getId())) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        List<OrderItem> orderItems = orderItemRepository.findByOrderIdWithProduct(orderId);
        List<Long> orderItemIds = orderItems.stream().map(OrderItem::getId).toList();

        Map<Long, Integer> returnableQuantityMap = orderItemRepository
                .findReturnableQuantities(orderItemIds)
                .stream()
                .collect(Collectors.toMap(
                        OrderItemRepository.ReturnableQuantity::getOrderItemId,
                        OrderItemRepository.ReturnableQuantity::getReturnableQuantity));

        return ReturnableOrderResponse.from(order, orderItems, returnableQuantityMap);
    }

    // 공통: summary 생성
    private String summarize(Order order) {
        List<OrderItem> items = order.getOrderItems();
        String firstProductName = items.getFirst().getProduct().getName();
        int count = items.size();
        return count > 1 ? firstProductName + " 외 " + (count - 1) + "건" : firstProductName;
    }
}
