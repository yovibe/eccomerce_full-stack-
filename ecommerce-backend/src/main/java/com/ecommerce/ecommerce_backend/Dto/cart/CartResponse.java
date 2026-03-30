package com.ecommerce.ecommerce_backend.Dto.cart;

import com.ecommerce.ecommerce_backend.Dto.Cartitem.CartItemResponse;

import java.util.List;

public record CartResponse(
        Long cartId,
        List<CartItemResponse> items
) {}