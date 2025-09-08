package com.SBS.E_commerce.service.serviceImpl;
import com.SBS.E_commerce.config.PageCache;
import com.SBS.E_commerce.dto.ProductRequestDTO;
import com.SBS.E_commerce.dto.ProductResponseDTO;
import com.SBS.E_commerce.elasticsearch.ProductIndex;
import com.SBS.E_commerce.elasticsearch.ProductSearchRepository;
import com.SBS.E_commerce.entity.Category;
import com.SBS.E_commerce.entity.Product;
import com.SBS.E_commerce.entity.ProductImage;
import com.SBS.E_commerce.exception.ResourceNotFoundException;
import com.SBS.E_commerce.repository.CategoryRepository;
import com.SBS.E_commerce.repository.ProductRepository;
import com.SBS.E_commerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;


@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CacheManager cacheManager;
    private ProductSearchRepository productSearchRepository;

    // ---------------- Create ----------------
    @Override
    @CachePut(value = "products", key = "#result.productId")
    @CacheEvict(value = {"allProducts", "searchProducts", "categoryProducts", "priceProducts"}, allEntries = true)
    public ProductResponseDTO createProduct(ProductRequestDTO dto, MultipartFile[] files) throws IOException {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found " + dto.getCategoryId()));

        Product product = Product.builder()
                .productId(UUID.randomUUID().toString())
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock())
                .category(category)
                .build();

        if (files != null && files.length > 0) {
            List<ProductImage> images = Arrays.stream(files)
                    .map(file -> {
                        try {
                            String uploadDir = "uploads/";
                            Files.createDirectories(Paths.get(uploadDir));
                            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                            Path filePath = Paths.get(uploadDir, fileName);
                            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                            String imageUrl = "/images/" + fileName;

                            return ProductImage.builder()
                                    .fileName(fileName)
                                    .fileType(file.getContentType())
                                    .url(imageUrl)
                                    .product(product)
                                    .build();
                        } catch (IOException e) {
                            throw new RuntimeException("Error saving file: " + file.getOriginalFilename(), e);
                        }
                    })
                    .toList();
            product.setImages(images);
        }

        // 1️⃣ Save into relational DB
        Product saved = productRepository.save(product);

        // 2️⃣ Also index into Elasticsearch
        ProductIndex index = new ProductIndex();
        index.setId(saved.getProductId()); // same ID
        index.setName(saved.getName());
        index.setPrice(saved.getPrice());
        index.setCategory(saved.getCategory().getName());
        productSearchRepository.save(index);

        // 3️⃣ Return response DTO
        return mapToResponseDTO(saved);
    }


    // ---------------- Update ----------------
    @Override
    @CachePut(value = "products", key = "#productId")
    @CacheEvict(value = {"allProducts", "searchProducts", "categoryProducts", "priceProducts"}, allEntries = true)
    public ProductResponseDTO updateProduct(String productId, ProductRequestDTO dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setCategory(category);

        return mapToResponseDTO(productRepository.save(product));
    }

    // ---------------- Delete ----------------
    @Override
    @CacheEvict(value = {"products", "allProducts", "searchProducts", "categoryProducts", "priceProducts"}, allEntries = true)
    public void deleteProduct(String productId) {
        productRepository.deleteById(productId);
    }

    // ---------------- Get by ID ----------------
    @Override
    @Cacheable(value = "products", key = "#productId")
    public ProductResponseDTO getProductById(String productId) {
        return productRepository.findById(productId)
                .map(this::mapToResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found " + productId));
    }

    // ---------------- Get all ----------------
    @Override
    public Page<ProductResponseDTO> getAllProducts(Pageable pageable) {
        // Better cache key: pageNumber-pageSize-sortString (sort included)
        String sortString = pageable.getSort() != null ? pageable.getSort().toString() : "";
        String cacheKey = pageable.getPageNumber() + "-" + pageable.getPageSize() + "-" + sortString;

        Cache cache = cacheManager.getCache("allProducts");
        if (cache != null) {
            // read cached wrapper
            PageCache<?> raw = cache.get(cacheKey, PageCache.class);
            if (raw != null && raw.getContent() != null) {
                @SuppressWarnings("unchecked")
                List<ProductResponseDTO> cachedContent = (List<ProductResponseDTO>) raw.getContent();
                return new PageImpl<>(
                        cachedContent,
                        PageRequest.of(raw.getPageNumber(), raw.getPageSize(), pageable.getSort()),
                        raw.getTotalElements()
                );
            }
        }

        // cache miss -> load from DB
        Page<ProductResponseDTO> page = productRepository.findAll(pageable)
                .map(this::mapToResponseDTO);

        // store wrapper in cache
        PageCache<ProductResponseDTO> pageCache = new PageCache<>(
                page.getContent(),
                page.getTotalElements(),
                page.getNumber(),
                page.getSize()
        );
        if (cache != null) {
            cache.put(cacheKey, pageCache);
        }

        return page;
    }


    // ---------------- Search ----------------
    @Override
    @Cacheable(value = "searchProducts", key = "#keyword")
    public List<ProductResponseDTO> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ---------------- Filter by Category ----------------
    @Override
    @Cacheable(value = "categoryProducts", key = "#categoryId")
    public List<ProductResponseDTO> filterProductsByCategory(String categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found " + categoryId));
        return productRepository.findByCategory(category)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ---------------- Filter by Price ----------------
    @Override
    @Cacheable(value = "priceProducts", key = "#minPrice + '-' + #maxPrice")
    public List<ProductResponseDTO> filterProductsByPrice(Double minPrice, Double maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ---------------- Mapper ----------------
    private ProductResponseDTO mapToResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryName(product.getCategory().getName())
                .imageUrls(product.getImages() != null
                        ? product.getImages().stream().map(ProductImage::getUrl).toList()
                        : List.of())
                .build();
    }
}
