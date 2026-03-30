package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.Dto.order.OrderResponse;
import com.ecommerce.ecommerce_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    // ✅ GET ALL ORDERS (ADMIN ONLY)
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ✅ UPDATE ORDER STATUS
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID orderId,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(
                orderService.updateOrderStatus(orderId, status)
        );
    }
}