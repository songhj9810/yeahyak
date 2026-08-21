package com.yeahyak.backend.domain.returnorder.dto.response;

import com.yeahyak.backend.domain.order.entity.Order;
import com.yeahyak.backend.domain.order.entity.OrderItem;
import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import com.yeahyak.backend.domain.returnorder.entity.ReturnOrder;
import com.yeahyak.backend.domain.returnorder.entity.ReturnOrderItem;
import com.yeahyak.backend.domain.returnorder.entity.ReturnOrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public record ReturnOrderResponse(
        Long id,
        Long orderId,
        String returnReason,
        ReturnOrderStatus status,
        String rejectReason,
        List<ReturnOrderItemResponse> returnItems,
        Integer totalPrice,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public static ReturnOrderResponse from(ReturnOrder returnOrder, List<ReturnOrderItem> returnOrderItems) {
        Order order = returnOrder.getOrder();
        return new ReturnOrderResponse(
                returnOrder.getId(),
                order.getId(), // ReturnOrder → Order → id
                returnOrder.getReturnReason(),
                returnOrder.getStatus(),
                returnOrder.getRejectReason(),
                returnOrderItems.stream().map(ReturnOrderItemResponse::from).toList(),
                returnOrder.getTotalPrice(),
                returnOrder.getCreatedAt(),
                returnOrder.getUpdatedAt());
    }

    public record ReturnOrderItemResponse(
            Long id,
            Long productId,
            String name,
            ProductSubCategory subCategory,
            String imageUrl,
            Integer price,
            Integer quantity,
            Integer totalPrice) {
        public static ReturnOrderItemResponse from(ReturnOrderItem returnOrderItem) {
            OrderItem orderItem = returnOrderItem.getOrderItem();
            Product product = orderItem.getProduct();
            return new ReturnOrderItemResponse(
                    returnOrderItem.getId(),
                    product.getId(), // ReturnOrderItem → OrderItem → Product → id
                    product.getName(), // ReturnOrderItem → OrderItem → Product → name
                    product.getSubCategory(), // ReturnOrderItem → OrderItem → Product → subCategory
                    product.getImageUrl(), // ReturnOrderItem → OrderItem → Product → imageUrl
                    orderItem.getPrice(), // ReturnOrderItem → OrderItem → price
                    returnOrderItem.getQuantity(),
                    returnOrderItem.getTotalPrice());
        }
    }
}
