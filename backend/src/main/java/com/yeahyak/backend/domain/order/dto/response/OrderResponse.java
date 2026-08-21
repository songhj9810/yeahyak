package com.yeahyak.backend.domain.order.dto.response;

import com.yeahyak.backend.domain.order.entity.Order;
import com.yeahyak.backend.domain.order.entity.OrderCanceledBy;
import com.yeahyak.backend.domain.order.entity.OrderItem;
import com.yeahyak.backend.domain.order.entity.OrderStatus;
import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        OrderStatus status,
        OrderCanceledBy canceledBy,
        List<OrderItemResponse> orderItems,
        Integer totalPrice,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public static OrderResponse from(Order order, List<OrderItem> orderItems) {
        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getCanceledBy(),
                orderItems.stream().map(OrderItemResponse::from).toList(),
                order.getTotalPrice(),
                order.getCreatedAt(),
                order.getUpdatedAt());
    }

    public record OrderItemResponse(
            Long id,
            Long productId,
            String name,
            ProductSubCategory subCategory,
            String imageUrl,
            Integer price,
            Integer quantity,
            Integer totalPrice) {
        public static OrderItemResponse from(OrderItem orderItem) {
            Product product = orderItem.getProduct();
            return new OrderItemResponse(
                    orderItem.getId(),
                    product.getId(), // OrderItem → Product → id
                    product.getName(), // OrderItem → Product → name
                    product.getSubCategory(), // OrderItem → Product → subCategory
                    product.getImageUrl(), // OrderItem → Product → imageUrl
                    orderItem.getPrice(),
                    orderItem.getQuantity(),
                    orderItem.getTotalPrice());
        }
    }
}
