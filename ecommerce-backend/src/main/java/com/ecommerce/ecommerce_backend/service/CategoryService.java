package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.Dto.Category.CategoryRequest;
import com.ecommerce.ecommerce_backend.Dto.Category.CategoryResponse;

import java.util.List;

public interface CategoryService {

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(Long id);

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse updateCategory(Long id, CategoryRequest request);

    void deleteCategory(Long id);
}