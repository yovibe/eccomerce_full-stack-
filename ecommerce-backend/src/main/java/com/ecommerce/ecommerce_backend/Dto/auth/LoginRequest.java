package com.ecommerce.ecommerce_backend.Dto.auth;

public record LoginRequest(
        String email,
        String password
) {}