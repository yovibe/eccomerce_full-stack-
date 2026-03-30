package com.ecommerce.ecommerce_backend.service_impl;

import com.ecommerce.ecommerce_backend.Dto.cart.CartResponse;
import com.ecommerce.ecommerce_backend.Dto.Cartitem.CartItemResponse;
import com.ecommerce.ecommerce_backend.entity.*;
import com.ecommerce.ecommerce_backend.repository.*;
import com.ecommerce.ecommerce_backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    @Override
    public CartResponse getCartByUserEmail(String email) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);
        return mapToResponse(cart);
    }

    @Override
    public CartResponse addProductToCart(String email, Long productId, int quantity) {

        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem existingItem = cart.getCartItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setPrice(product.getPrice());

            cart.getCartItems().add(item);
        }

        return mapToResponse(cart);
    }

    @Override
    public CartResponse updateCartItemQuantity(String email, Long cartItemId, int quantity) {

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // 🔥 SECURITY CHECK
        if (!item.getCart().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        item.setQuantity(quantity);

        return mapToResponse(item.getCart());
    }

    @Override
    public void removeProductFromCart(String email, Long cartItemId) {

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // 🔥 SECURITY CHECK
        if (!item.getCart().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        cartItemRepository.delete(item);
    }
    @Override
    public Cart getCartEntityByUserEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    @Override
    public void clearCart(String email) {

        User user = getUserByEmail(email);

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteByCart(cart);
    }

    private CartResponse mapToResponse(Cart cart) {

        List<CartItemResponse> items = cart.getCartItems()
                .stream()
                .map(item -> new CartItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getPrice(),
                        item.getQuantity()
                ))
                .toList();

        return new CartResponse(
                cart.getId(),
                items
        );
    }
}