package com.yeahyak.backend.domain.order.dto.response;

import com.yeahyak.backend.domain.order.entity.Order;
import com.yeahyak.backend.domain.order.entity.OrderItem;
import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;

import java.util.List;
import java.util.Map;

public record ReturnableOrderResponse(
        Long id,
        List<ReturnableOrderItemResponse> orderItems) {
    public static ReturnableOrderResponse from(Order order, List<OrderItem> orderItems, Map<Long, Integer> returnableQuantityMap) {
        return new ReturnableOrderResponse(
                order.getId(),
                orderItems.stream().map(oi -> ReturnableOrderItemResponse.from(
                        oi,
                        returnableQuantityMap.getOrDefault(oi.getId(), 0) // id 매핑
                )).toList());
    }

    public record ReturnableOrderItemResponse(
            Long id,
            Long productId,
            String name,
            ProductSubCategory subCategory,
            String imageUrl,
            Integer price,
            Integer orderedQuantity,
            Integer returnableQuantity) {
        public static ReturnableOrderItemResponse from(OrderItem orderItem, Integer returnableQuantity) {
            Product product = orderItem.getProduct();
            return new ReturnableOrderItemResponse(
                    orderItem.getId(),
                    product.getId(), // OrderItem → Product → id
                    product.getName(), // OrderItem → Product → name
                    product.getSubCategory(), // OrderItem → Product → subCategory
                    product.getImageUrl(), // OrderItem → Product → imageUrl
                    orderItem.getPrice(),
                    orderItem.getQuantity(),
                    returnableQuantity);
        }
    }
}
