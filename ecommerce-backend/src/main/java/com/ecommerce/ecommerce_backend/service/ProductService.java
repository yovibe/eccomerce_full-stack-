package com.ecommerce.ecommerce_backend.service;

import com.ecommerce.ecommerce_backend.Dto.product.ProductRequest;
import com.ecommerce.ecommerce_backend.Dto.product.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

    ProductResponse getProductById(Long id);

    List<ProductResponse> getAllProducts();

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    List<ProductResponse> getProductsByCategoryId(Long categoryId);
}