package com.ecommerce.ecommerce_backend.Dto.product;

import java.math.BigDecimal;
import java.util.List;

public record ProductResponse(
        Long id,
        String name,
        BigDecimal price,
        String description,
        String material,
        String warranty,
        List<String> imageUrls,
        String categoryName
) {}