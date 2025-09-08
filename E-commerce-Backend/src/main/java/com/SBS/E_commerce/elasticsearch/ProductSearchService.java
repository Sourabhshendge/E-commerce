package com.SBS.E_commerce.elasticsearch;

import com.SBS.E_commerce.dto.ProductResponseDTO;
import com.SBS.E_commerce.entity.Product;
import com.SBS.E_commerce.entity.ProductImage;
import com.SBS.E_commerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductSearchService {

    private final ProductSearchRepository repository;

    @Autowired
    private ElasticsearchOperations elasticsearchOperations;

    @Autowired
    private ProductRepository productRepository;

    public ProductSearchService(ProductSearchRepository repository) {
        this.repository = repository;
    }

    // Save a product to index
    public ProductIndex save(ProductIndex product) {
        return repository.save(product);
    }

    public List<ProductResponseDTO> smartSearch(String query) {
        Criteria criteria = new Criteria();
        double maxPrice = Double.MAX_VALUE;
        double minPrice = 0.0;

        try {
            String lowerQuery = query.toLowerCase();

            // Handle "under <price>"
            if (lowerQuery.contains("under")) {
                String priceStr = lowerQuery.split("under")[1].trim().replaceAll("[^0-9]", "");
                if (!priceStr.isEmpty()) maxPrice = Double.parseDouble(priceStr);
                query = query.split("under")[0].trim(); // remove price part
            }
            // Handle "above <price>"
            else if (lowerQuery.contains("above")) {
                String priceStr = lowerQuery.split("above")[1].trim().replaceAll("[^0-9]", "");
                if (!priceStr.isEmpty()) minPrice = Double.parseDouble(priceStr);
                query = query.split("above")[0].trim(); // remove price part
            }

            // Name matching (case-insensitive, partial match)
            if (!query.isEmpty()) {
                criteria = criteria.and(new Criteria("name").contains(query));
            }

            // Apply price filter
            criteria = criteria.and(new Criteria("price").between(minPrice, maxPrice));

        } catch (Exception e) {
            System.err.println("Error parsing query: " + e.getMessage());
        }

        // Elasticsearch search
        Query searchQuery = new CriteriaQuery(criteria);
        SearchHits<ProductIndex> hits = elasticsearchOperations.search(searchQuery, ProductIndex.class);

        // Fetch full product data from MySQL
        List<String> productIds = hits.stream()
                .map(hit -> hit.getContent().getId())
                .toList();
        List<Product> products = productRepository.findAllById(productIds);

        // Map to DTO
        return products.stream()
                .map(this::mapToDTO)
                .toList();
    }



    // Filter by category
    public List<ProductIndex> filterByCategory(String category) {
        return repository.findByCategory(category);
    }

    private ProductResponseDTO mapToDTO(Product product) {
        return ProductResponseDTO.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .imageUrls(product.getImages() != null ?
                        product.getImages().stream().map(img -> img.getUrl()).toList() :
                        List.of())
                .build();
    }
}
