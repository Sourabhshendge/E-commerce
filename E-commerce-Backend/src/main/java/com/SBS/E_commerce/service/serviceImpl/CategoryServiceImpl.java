package com.SBS.E_commerce.service.serviceImpl;
import com.SBS.E_commerce.dto.CategoryDTO;
import com.SBS.E_commerce.dto.CategoryResponseDTO;
import com.SBS.E_commerce.entity.Category;
import com.SBS.E_commerce.exception.ResourceNotFoundException;
import com.SBS.E_commerce.repository.CategoryRepository;
import com.SBS.E_commerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryDTO createCategory(CategoryDTO dto) {

        Category category = Category.builder()
                .categoryId(UUID.randomUUID().toString())
                .name(dto.getName())
                .build();

        return mapToDTO(categoryRepository.save(category));
    }

    @Override
    public CategoryDTO updateCategory(String categoryId, CategoryDTO dto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"+ categoryId));
        category.setName(dto.getName());

        return mapToDTO(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(String categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    @Override
    public CategoryDTO getCategoryById(String categoryId) {
        return categoryRepository.findById(categoryId)
                .map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"+ categoryId));
    }

    @Override
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToDTOS)
                .collect(Collectors.toList());
    }

    private CategoryDTO mapToDTO(Category category) {
        return CategoryDTO.builder()
                .name(category.getName())
                .build();
    }

    private CategoryResponseDTO mapToDTOS(Category category) {
        CategoryResponseDTO dto = new CategoryResponseDTO();
        dto.setId(category.getCategoryId());
        dto.setName(category.getName());
        return dto;
    }
}
