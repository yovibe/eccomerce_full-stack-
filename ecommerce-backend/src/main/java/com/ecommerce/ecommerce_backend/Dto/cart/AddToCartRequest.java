package com.ecommerce.ecommerce_backend.Dto.cart;

public record AddToCartRequest(
        Long userId,
        Long productId,
        int quantity
) {}