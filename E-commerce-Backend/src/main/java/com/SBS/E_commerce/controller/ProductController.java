package com.SBS.E_commerce.controller;

import com.SBS.E_commerce.dto.ApiResponse;
import com.SBS.E_commerce.dto.PageResponse;
import com.SBS.E_commerce.dto.ProductRequestDTO;
import com.SBS.E_commerce.dto.ProductResponseDTO;
import com.SBS.E_commerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ---------------- ADMIN APIs ----------------

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<ProductResponseDTO>> createProduct(
            @RequestPart("product") ProductRequestDTO dto,
            @RequestPart(value = "files", required = false) MultipartFile[] files
    ) throws IOException {
        ProductResponseDTO response = productService.createProduct(dto, files);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product created successfully", response));
    }


    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProduct(
            @PathVariable String productId,
            @RequestBody ProductRequestDTO dto) {
        ProductResponseDTO response = productService.updateProduct(productId, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product updated successfully", response));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product deleted successfully", null));
    }

    // ---------------- CUSTOMER APIs ----------------

    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> getProductById(@PathVariable String productId) {
        ProductResponseDTO response = productService.getProductById(productId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product fetched successfully", response));
    }

    @GetMapping("/page")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponseDTO>>> getAllProducts(Pageable pageable) {
        Page<ProductResponseDTO> page = productService.getAllProducts(pageable);
        PageResponse<ProductResponseDTO> response = new PageResponse<>(page);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Products fetched with pagination & sorting", response)
        );
    }


    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> searchProducts(@RequestParam String keyword) {
        List<ProductResponseDTO> response = productService.searchProducts(keyword);
        return ResponseEntity.ok(new ApiResponse<>(true, "Search results fetched successfully", response));
    }

    @GetMapping("/filter/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> filterByCategory(@PathVariable String categoryId) {
        List<ProductResponseDTO> response = productService.filterProductsByCategory(categoryId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Products filtered by category", response));
    }

    @GetMapping("/filter/price")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> filterByPrice(
            @RequestParam Double min,
            @RequestParam Double max) {
        List<ProductResponseDTO> response = productService.filterProductsByPrice(min, max);
        return ResponseEntity.ok(new ApiResponse<>(true, "Products filtered by price range", response));
    }
}

