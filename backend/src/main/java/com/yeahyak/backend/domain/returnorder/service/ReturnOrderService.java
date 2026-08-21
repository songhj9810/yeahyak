package com.yeahyak.backend.domain.returnorder.service;

import com.yeahyak.backend.domain.order.entity.Order;
import com.yeahyak.backend.domain.order.entity.OrderItem;
import com.yeahyak.backend.domain.order.repository.OrderItemRepository;
import com.yeahyak.backend.domain.order.repository.OrderRepository;
import com.yeahyak.backend.domain.returnorder.dto.request.ReturnOrderCreateRequest;
import com.yeahyak.backend.domain.returnorder.dto.request.ReturnOrderRejectRequest;
import com.yeahyak.backend.domain.returnorder.dto.response.AdminReturnOrderListResponse;
import com.yeahyak.backend.domain.returnorder.dto.response.PharmacyReturnOrderListResponse;
import com.yeahyak.backend.domain.returnorder.dto.response.ReturnOrderResponse;
import com.yeahyak.backend.domain.returnorder.dto.response.ReturnOrderStatisticsResponse;
import com.yeahyak.backend.domain.returnorder.entity.ReturnOrder;
import com.yeahyak.backend.domain.returnorder.entity.ReturnOrderItem;
import com.yeahyak.backend.domain.returnorder.entity.ReturnOrderStatus;
import com.yeahyak.backend.domain.returnorder.repository.ReturnOrderItemRepository;
import com.yeahyak.backend.domain.returnorder.repository.ReturnOrderRepository;
import com.yeahyak.backend.domain.stock.service.HqStockService;
import com.yeahyak.backend.domain.stock.service.PharmacyStockService;
import com.yeahyak.backend.domain.user.entity.Pharmacy;
import com.yeahyak.backend.domain.user.entity.PharmacyRegion;
import com.yeahyak.backend.domain.user.entity.UserRole;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReturnOrderService {

    private final ReturnOrderRepository returnOrderRepository;
    private final ReturnOrderItemRepository returnOrderItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PharmacyRepository pharmacyRepository;
    private final WalletService walletService;
    private final HqStockService hqStockService;
    private final PharmacyStockService pharmacyStockService;

    // 반품 생성
    @Transactional
    public void createReturnOrder(Long userId, ReturnOrderCreateRequest request) {
        Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));
        if (!order.getPharmacy().getId().equals(pharmacy.getId())) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        ReturnOrder returnOrder = ReturnOrder.create(order, request.returnReason());
        returnOrderRepository.save(returnOrder);

        List<OrderItem> orderItems = orderItemRepository.findByOrderIdWithProduct(order.getId());
        Map<Long, OrderItem> orderItemMap = orderItems.stream()
                .collect(Collectors.toMap(OrderItem::getId, oi -> oi));

        // 반품 가능 수량 일괄 조회 (N+1 방지, REJECTED 상태 제외)
        List<Long> orderItemIds = request.returnOrderItems().stream()
                .map(item -> item.orderItemId())
                .toList();
        Map<Long, Integer> returnableMap = orderItemRepository.findReturnableQuantities(orderItemIds)
                .stream()
                .collect(Collectors.toMap(
                        OrderItemRepository.ReturnableQuantity::getOrderItemId,
                        OrderItemRepository.ReturnableQuantity::getReturnableQuantity));

        List<ReturnOrderItem> returnOrderItems = request.returnOrderItems().stream()
                .map(item -> {
                    OrderItem orderItem = Optional.ofNullable(orderItemMap.get(item.orderItemId()))
                            .orElseThrow(() -> new CustomException(ErrorCode.ORDER_ITEM_NOT_FOUND));

                    // 반품 가능 수량 검증
                    int returnable = returnableMap.getOrDefault(item.orderItemId(), 0);
                    if (item.quantity() > returnable) {
                        throw new CustomException(ErrorCode.INSUFFICIENT_RETURNABLE_QUANTITY);
                    }

                    return ReturnOrderItem.create(returnOrder, orderItem, item.quantity());
                })
                .toList();
        returnOrderItemRepository.saveAll(returnOrderItems);
    }

    // 반품 승인
    @Transactional
    public void approveReturnOrder(Long returnOrderId) {
        ReturnOrder returnOrder = returnOrderRepository.findById(returnOrderId)
                .orElseThrow(() -> new CustomException(ErrorCode.RETURN_ORDER_NOT_FOUND));
        returnOrder.approve();

        List<ReturnOrderItem> returnOrderItems = returnOrderItemRepository.findByReturnOrderIdWithProduct(returnOrderId);

        // 약국 재고 출고
        for (ReturnOrderItem item : returnOrderItems) {
            pharmacyStockService.returnOrderOut(
                    returnOrder.getPharmacy().getId(),
                    item.getOrderItem().getProduct().getId(),
                    item.getQuantity(),
                    item.getId());
        }
    }

    // 반품 반려
    @Transactional
    public void rejectReturnOrder(Long returnOrderId, ReturnOrderRejectRequest request) {
        ReturnOrder returnOrder = returnOrderRepository.findById(returnOrderId)
                .orElseThrow(() -> new CustomException(ErrorCode.RETURN_ORDER_NOT_FOUND));
        returnOrder.reject(request.rejectReason());
    }

    // 반품 처리
    @Transactional
    public void processReturnOrder(Long returnOrderId) {
        ReturnOrder returnOrder = returnOrderRepository.findById(returnOrderId)
                .orElseThrow(() -> new CustomException(ErrorCode.RETURN_ORDER_NOT_FOUND));
        returnOrder.process();
    }

    // 반품 완료
    @Transactional
    public void completeReturnOrder(Long returnOrderId) {
        ReturnOrder returnOrder = returnOrderRepository.findById(returnOrderId)
                .orElseThrow(() -> new CustomException(ErrorCode.RETURN_ORDER_NOT_FOUND));
        returnOrder.complete();

        List<ReturnOrderItem> returnOrderItems = returnOrderItemRepository.findByReturnOrderIdWithProduct(returnOrderId);

        // 본사 재고 입고
        for (ReturnOrderItem returnOrderItem : returnOrderItems) {
            hqStockService.returnOrderIn(
                    returnOrderItem.getOrderItem().getProduct().getId(),
                    returnOrderItem.getQuantity(),
                    returnOrderItem.getId());
        }

        // 잔액 복구
        Integer totalPrice = returnOrderItems.stream()
                .mapToInt(ReturnOrderItem::getTotalPrice)
                .sum();
        walletService.refund(returnOrder.getPharmacy().getId(), totalPrice, returnOrder.getId());
    }

    // 발주 통계 조회
    public ReturnOrderStatisticsResponse getReturnOrderStatistics() {
        LocalDateTime start = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = LocalDateTime.now().with(LocalTime.MAX);
        return new ReturnOrderStatisticsResponse(
                returnOrderRepository.countByCreatedAtBetween(start, end),
                returnOrderRepository.countByStatusAndCreatedAtBetween(ReturnOrderStatus.PROCESSING, start, end),
                returnOrderRepository.countByStatusAndCreatedAtBetween(ReturnOrderStatus.COMPLETED, start, end),
                returnOrderRepository.sumTotalPriceByCreatedAtBetween(start, end));
    }

    // 반품 목록 조회 (약국)
    public PageResponse<PharmacyReturnOrderListResponse> getReturnOrdersByUserId(Long userId,
                                                                                 ReturnOrderStatus status,
                                                                                 LocalDateTime start,
                                                                                 LocalDateTime end,
                                                                                 Pageable pageable) {
        return PageResponse.from(
                returnOrderRepository.searchReturnOrdersByPharmacy(userId, status, start, end, pageable)
                        .map(r -> PharmacyReturnOrderListResponse.from(r, summarize(r))));
    }

    // 반품 목록 조회 (어드민)
    public PageResponse<AdminReturnOrderListResponse> getReturnOrders(PharmacyRegion region,
                                                                      ReturnOrderStatus status,
                                                                      LocalDateTime start,
                                                                      LocalDateTime end,
                                                                      Pageable pageable) {
        return PageResponse.from(
                returnOrderRepository.searchReturnOrdersByAdmin(region, status, start, end, pageable)
                        .map(r -> AdminReturnOrderListResponse.from(r, summarize(r))));
    }

    // 반품 상세 조회
    public ReturnOrderResponse getReturnOrder(Long returnOrderId, Long userId, UserRole role) {
        ReturnOrder returnOrder = returnOrderRepository.findById(returnOrderId)
                .orElseThrow(() -> new CustomException(ErrorCode.RETURN_ORDER_NOT_FOUND));

        if (role == UserRole.PHARMACY) {
            Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                    .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
            if (!returnOrder.getPharmacy().getId().equals(pharmacy.getId())) {
                throw new CustomException(ErrorCode.FORBIDDEN);
            }
        }

        List<ReturnOrderItem> returnOrderItems = returnOrderItemRepository.findByReturnOrderIdWithProduct(returnOrderId);
        return ReturnOrderResponse.from(returnOrder, returnOrderItems);
    }

    // 공통: summary 생성
    private String summarize(ReturnOrder returnOrder) {
        List<ReturnOrderItem> items = returnOrder.getReturnOrderItems();
        String firstProductName = items.getFirst().getOrderItem().getProduct().getName();
        int count = items.size();
        return count > 1 ? firstProductName + " 외 " + (count - 1) + "건" : firstProductName;
    }
}
