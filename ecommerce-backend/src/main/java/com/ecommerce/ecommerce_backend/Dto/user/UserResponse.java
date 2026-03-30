package com.ecommerce.ecommerce_backend.Dto.user;

import com.ecommerce.ecommerce_backend.enums.Role;

import java.time.LocalDateTime;

public record UserResponse(

        Long id,
        String firstName,
        String lastName,
        String email,
        Role role,
        LocalDateTime createdAt,
        LocalDateTime updatedAt

) {
}