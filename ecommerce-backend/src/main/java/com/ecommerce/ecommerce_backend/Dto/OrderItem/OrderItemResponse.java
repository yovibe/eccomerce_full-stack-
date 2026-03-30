package com.ecommerce.ecommerce_backend.Dto.OrderItem;

import java.util.UUID;

public record OrderItemResponse(
        Long productId,
        String productName,
        double price,
        int quantity
) {}