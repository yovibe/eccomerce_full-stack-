package com.ecommerce.ecommerce_backend.service_impl;

import com.ecommerce.ecommerce_backend.Dto.product.ProductRequest;
import com.ecommerce.ecommerce_backend.Dto.product.ProductResponse;
import com.ecommerce.ecommerce_backend.entity.Category;
import com.ecommerce.ecommerce_backend.entity.OrderItem;
import com.ecommerce.ecommerce_backend.entity.Product;
import com.ecommerce.ecommerce_backend.entity.ProductImage;
import com.ecommerce.ecommerce_backend.repository.CartItemRepository;
import com.ecommerce.ecommerce_backend.repository.CategoryRepository;
import com.ecommerce.ecommerce_backend.repository.OrderItemRepository;
import com.ecommerce.ecommerce_backend.repository.ProductRepository;
import com.ecommerce.ecommerce_backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;

    private ProductResponse mapToResponse(Product product) {

        List<String> imageUrls = product.getImages()
                .stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getDescription(),
                product.getMaterial(),
                product.getWarranty(),
                imageUrls,
                product.getCategory().getName()
        );
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(request.name());
        product.setPrice(request.price());
        product.setDescription(request.description());
        product.setMaterial(request.material());
        product.setWarranty(request.warranty());
        product.setCategory(category);

        List<ProductImage> images = request.imageUrls().stream()
                .map(url -> {
                    ProductImage image = new ProductImage();
                    image.setImageUrl(url);
                    image.setProduct(product);
                    return image;
                })
                .collect(Collectors.toList());

        product.setImages(images);

        Product savedProduct = productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    @Override
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setName(request.name());
        product.setPrice(request.price());
        product.setDescription(request.description());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);

        return mapToResponse(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Delete associated cart items first to prevent foreign key constraint violation
        cartItemRepository.deleteByProductId(id);

        // Disassociate product from order items to preserve order history but allow product deletion
        List<OrderItem> orderItems = orderItemRepository.findByProductId(id);
        for (OrderItem item : orderItems) {
            item.setProduct(null);
        }
        orderItemRepository.saveAll(orderItems);

        productRepository.delete(product);
    }

    @Override
    public List<ProductResponse> getProductsByCategoryId(Long categoryId) {

        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return productRepository.findByCategory_Id(categoryId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}