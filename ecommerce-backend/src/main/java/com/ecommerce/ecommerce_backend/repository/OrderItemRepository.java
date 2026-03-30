package com.ecommerce.ecommerce_backend.repository;

import com.ecommerce.ecommerce_backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    List<OrderItem> findByProductId(Long productId);
}
