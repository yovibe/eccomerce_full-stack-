package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.Dto.order.OrderResponse;

import java.util.List;
import java.util.UUID;

public interface OrderService {

    OrderResponse checkout(String email);

    List<OrderResponse> getUserOrders(String email);

    OrderResponse getOrderById(String email, UUID orderId);

    List<OrderResponse> getAllOrders();

    OrderResponse updateOrderStatus(UUID orderId, String status);
}