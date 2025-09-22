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


    public List<ProductResponseDTO> smartSearch(String query) {
        double maxPrice = Double.MAX_VALUE;
        double minPrice = 0.0;

        try {
            String lowerQuery = query.toLowerCase();

            if (lowerQuery.contains("under")) {
                String priceStr = lowerQuery.split("under")[1].trim().replaceAll("[^0-9]", "");
                if (!priceStr.isEmpty()) maxPrice = Double.parseDouble(priceStr);
                query = query.split("under")[0].trim();
            }
            if (lowerQuery.contains("above")) {
                String priceStr = lowerQuery.split("above")[1].trim().replaceAll("[^0-9]", "");
                if (!priceStr.isEmpty()) minPrice = Double.parseDouble(priceStr);
                query = query.split("above")[0].trim();
            }
        } catch (Exception e) {
            System.err.println("Error parsing query: " + e.getMessage());
        }

        String[] terms = query.trim().toLowerCase().split("\\s+");

        Criteria phraseCriteria = new Criteria("name").expression("\"" + query.trim() + "\"");

        Criteria fuzzyCriteria = null;
        for (String term : terms) {
            if (!term.isEmpty()) {
                if (fuzzyCriteria == null) {
                    fuzzyCriteria = new Criteria("name").fuzzy(term);
                } else {
                    fuzzyCriteria = fuzzyCriteria.and(new Criteria("name").fuzzy(term));
                }
            }
        }

        Criteria criteria;
        if (fuzzyCriteria != null) {
            criteria = new Criteria().or(phraseCriteria).or(fuzzyCriteria);
        } else {
            criteria = phraseCriteria;
        }

        criteria = criteria.and(new Criteria("price").between(minPrice, maxPrice));

        Query searchQuery = new CriteriaQuery(criteria);

        SearchHits<ProductIndex> hits = elasticsearchOperations.search(searchQuery, ProductIndex.class);

        List<String> productIds = hits.stream()
                .map(hit -> hit.getContent().getId())
                .toList();

        List<Product> products = productRepository.findAllById(productIds);

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
