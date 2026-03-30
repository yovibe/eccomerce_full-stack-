package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.Dto.auth.AuthResponse;
import com.ecommerce.ecommerce_backend.Dto.auth.LoginRequest;
import com.ecommerce.ecommerce_backend.Dto.user.CreateUserRequest;
import com.ecommerce.ecommerce_backend.Dto.user.UserResponse;
import com.ecommerce.ecommerce_backend.service.AuthService;
import com.ecommerce.ecommerce_backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService; // ✅ add this

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody CreateUserRequest request
    ) {
        return ResponseEntity.ok(userService.createUser(request)); // ✅ use this
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }
}