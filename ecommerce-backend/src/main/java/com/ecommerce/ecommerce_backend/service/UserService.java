package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.Dto.user.CreateUserRequest;
import com.ecommerce.ecommerce_backend.Dto.user.UpdateUserRequest;
import com.ecommerce.ecommerce_backend.Dto.user.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(CreateUserRequest request);

    // Used when frontend wants user profile
    UserResponse getUserById(Long userId);

    // For admin only
    List<UserResponse> getAllUsers();

    UserResponse updateUser(Long userId, UpdateUserRequest request);

    // For admin
    void deleteUser(Long userId);
}