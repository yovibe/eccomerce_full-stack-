package com.ecommerce.ecommerce_backend.Dto.product;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        String name,
        BigDecimal price,
        String description,
        String material,
        String warranty,
        Long categoryId,
        List<String> imageUrls

) {}