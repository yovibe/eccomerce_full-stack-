package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.Dto.auth.AuthResponse;
import com.ecommerce.ecommerce_backend.Dto.auth.LoginRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);
}