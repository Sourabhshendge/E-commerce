package com.SBS.E_commerce.service;
import com.SBS.E_commerce.dto.CategoryDTO;
import com.SBS.E_commerce.dto.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {
    CategoryDTO createCategory(CategoryDTO dto);
    CategoryDTO updateCategory(String categoryId, CategoryDTO dto);
    void deleteCategory(String categoryId);
    CategoryDTO getCategoryById(String categoryId);
    List<CategoryResponseDTO> getAllCategories();
}
