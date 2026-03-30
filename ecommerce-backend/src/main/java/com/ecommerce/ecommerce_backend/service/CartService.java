package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.Dto.cart.CartResponse;
import com.ecommerce.ecommerce_backend.entity.Cart;

public interface CartService {

    CartResponse getCartByUserEmail(String email);



    CartResponse addProductToCart(String email, Long productId, int quantity);

    CartResponse updateCartItemQuantity(String email, Long cartItemId, int quantity);

    void removeProductFromCart(String email, Long cartItemId);
    Cart getCartEntityByUserEmail(String email);

    void clearCart(String email);
}