package com.ecommerce.ecommerce_backend.entity;

import com.ecommerce.ecommerce_backend.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "customer_order") // rename table
@Data
public class Order {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private User user;

    private double totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus status; // PENDING, PAID, SHIPPED

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @PrePersist
    public void onCreate(){
        createdAt = LocalDateTime.now();
    }
}