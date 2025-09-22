package com.SBS.E_commerce.service.serviceImpl;

import com.SBS.E_commerce.dto.ProductResponseDTO;
import com.SBS.E_commerce.entity.Product;
import com.SBS.E_commerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RestTemplate restTemplate;
    private final ProductRepository productRepository;

    private final String fastapiUrl = "http://localhost:8000/recommend";

    public List<ProductResponseDTO> getRecommendations(String productName, int topN) {
        // 1️⃣ Call FastAPI
        String json = String.format("{\"product_name\": \"%s\"}", productName);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(json, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(fastapiUrl, entity, Map.class);

        // 2️⃣ Extract recommendations correctly
        List<Map<String, Object>> recList = (List<Map<String, Object>>) response.getBody().get("recommendations");

        List<String> recommendedNames = recList.stream()
                .map(rec -> (String) rec.get("name")) // ✅ Extract only the name
                .toList();

        if (recommendedNames.isEmpty()) {
            return List.of();
        }

        // 3️⃣ Fetch products from DB
        List<Product> products = productRepository.findByNameIn(recommendedNames);

        return products.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }


    // ✅ Mapping method you provided
    private ProductResponseDTO mapToResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .productId(product.getProductId())  // assuming getProductId() returns String
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : "")
                .imageUrls(product.getImages() != null
                        ? product.getImages().stream().map(img -> img.getUrl()).toList()
                        : List.of())
                .build();
    }
}
