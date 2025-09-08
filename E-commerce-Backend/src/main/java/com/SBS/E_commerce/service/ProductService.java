package com.SBS.E_commerce.service;
import com.SBS.E_commerce.dto.ProductRequestDTO;
import com.SBS.E_commerce.dto.ProductResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    ProductResponseDTO createProduct(ProductRequestDTO dto, MultipartFile[] files) throws IOException;
    ProductResponseDTO updateProduct(String productId, ProductRequestDTO dto);
    void deleteProduct(String productId);
    ProductResponseDTO getProductById(String productId);
    Page<ProductResponseDTO> getAllProducts(Pageable pageable);
    List<ProductResponseDTO> searchProducts(String keyword);
    List<ProductResponseDTO> filterProductsByCategory(String categoryId);
    List<ProductResponseDTO> filterProductsByPrice(Double minPrice, Double maxPrice);
}

