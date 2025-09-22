package com.SBS.E_commerce.service.serviceImpl;

import com.SBS.E_commerce.dto.ProductResponseDTO;
import com.SBS.E_commerce.entity.LikedProduct;
import com.SBS.E_commerce.entity.Product;
import com.SBS.E_commerce.entity.ProductImage;
import com.SBS.E_commerce.repository.LikedProductRepository;
import com.SBS.E_commerce.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LikedProductService {

    @Autowired
    private LikedProductRepository repository;

    @Autowired
    private ProductRepository productRepository;

    public void likeProduct(String userId, String productId) {
        if (repository.findByUserIdAndProductId(userId, productId).isEmpty()) {
            LikedProduct likedProduct = new LikedProduct();
            likedProduct.setUserId(userId);
            likedProduct.setProductId(productId);
            repository.save(likedProduct);
        }
    }

    @Transactional
    public void dislikeProduct(String userId, String productId) {
        repository.deleteByUserIdAndProductId(userId, productId);
    }

    public List<ProductResponseDTO> getLikedProducts(String userId) {
        // Find all liked products by the user
        List<LikedProduct> likedProducts = repository.findByUserId(userId);

        // Map each liked product to ProductResponseDTO using the existing mapping method
        return likedProducts.stream()
                .map(liked -> productRepository.findById(liked.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found with ID: " + liked.getProductId())))
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Existing mapping method you've provided
    private ProductResponseDTO mapToResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .productId(product.getProductId())  // assuming getProductId() returns String
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : "")
                .imageUrls(product.getImages() != null
                        ? product.getImages().stream().map(ProductImage::getUrl).toList()
                        : List.of())
                .build();
    }
}

