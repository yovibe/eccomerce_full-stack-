package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.Dto.cart.AddToCartRequest;
import com.ecommerce.ecommerce_backend.Dto.cart.CartResponse;
import com.ecommerce.ecommerce_backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // ✅ GET MY CART
    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        return ResponseEntity.ok(
                cartService.getCartByUserEmail(authentication.getName())
        );
    }

    // ✅ ADD TO MY CART
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(
            @RequestBody AddToCartRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                cartService.addProductToCart(
                        authentication.getName(),
                        request.productId(),
                        request.quantity()
                )
        );
    }

    // ✅ UPDATE ITEM
    @PutMapping("/item/{itemId}")
    public ResponseEntity<CartResponse> updateQuantity(@PathVariable Long itemId, @RequestParam int quantity,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                cartService.updateCartItemQuantity(
                        authentication.getName(),
                        itemId,
                        quantity
                )
        );
    }

    // ✅ REMOVE ITEM
    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<Void> removeItem(
            @PathVariable Long itemId,
            Authentication authentication
    ) {
        cartService.removeProductFromCart(authentication.getName(), itemId);
        return ResponseEntity.noContent().build();
    }

    // ✅ CLEAR CART
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}