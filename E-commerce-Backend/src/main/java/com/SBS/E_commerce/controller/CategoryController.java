package com.SBS.E_commerce.controller;
import com.SBS.E_commerce.dto.ApiResponse;
import com.SBS.E_commerce.dto.CategoryDTO;
import com.SBS.E_commerce.dto.CategoryResponseDTO;
import com.SBS.E_commerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // ---------------- ADMIN APIs ----------------

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@RequestBody CategoryDTO dto) {
        CategoryDTO response = categoryService.createCategory(dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Category created successfully", response));
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable String categoryId,
            @RequestBody CategoryDTO dto) {
        CategoryDTO response = categoryService.updateCategory(categoryId, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Category updated successfully", response));
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable String categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Category deleted successfully", null));
    }

    // ---------------- PUBLIC APIs ----------------

    @GetMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<CategoryDTO>> getCategoryById(@PathVariable String categoryId) {
        CategoryDTO response = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Category fetched successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponseDTO>>> getAllCategories() {
        List<CategoryResponseDTO> response = categoryService.getAllCategories();
        return ResponseEntity.ok(new ApiResponse<>(true, "All categories fetched successfully", response));
    }
}

