package com.ecommerce.ecommerce_backend.controller;

import com.ecommerce.ecommerce_backend.Dto.Category.CategoryRequest;
import com.ecommerce.ecommerce_backend.Dto.Category.CategoryResponse;
import com.ecommerce.ecommerce_backend.Dto.product.ProductResponse;
import com.ecommerce.ecommerce_backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "https://eccomerce-full-stack.vercel.app"})
public class CategoryController {

    private final CategoryService categoryService;

    // ✅ Get all categories
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // ✅ Get category by ID
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    // ✅ Create category
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody CategoryRequest request) {

        CategoryResponse created = categoryService.createCategory(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // ✅ Update category
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequest request) {

        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    // ✅ Delete category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {

        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}