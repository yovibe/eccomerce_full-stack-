package com.ecommerce.ecommerce_backend.Dto.order;

import com.ecommerce.ecommerce_backend.Dto.OrderItem.OrderItemResponse;

import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID orderId,
        String status,
        double totalPrice,
        List<OrderItemResponse> orderItems
) {}
