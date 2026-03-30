package com.ecommerce.ecommerce_backend.Dto.user;

public record UpdateUserRequest(

        String firstName,
        String lastName,
        String email,
        String password
) {
}