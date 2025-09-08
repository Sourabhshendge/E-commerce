package com.SBS.E_commerce.service.serviceImpl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.SBS.E_commerce.elasticsearch.ProductIndex;
import com.SBS.E_commerce.entity.Product;
import com.SBS.E_commerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class DataMigrationService {

    @Autowired
    private ProductRepository productRepository; // JPA (MySQL)

    @Autowired
    private ElasticsearchClient elasticsearchClient; // ES client

    public void migrateProducts() throws IOException {
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            // Map Product -> ProductIndex
            ProductIndex index = mapToIndex(product);

            // Index into Elasticsearch
            IndexResponse response = elasticsearchClient.index(i -> i
                    .index("products")
                    .id(index.getId())
                    .document(index)
            );

            System.out.println("Indexed product: " + index.getName() + " -> " + response.result());
        }
    }

    private ProductIndex mapToIndex(Product product) {
        return new ProductIndex(
                product.getProductId(),
                product.getName(),
                product.getPrice(),
                product.getCategory() != null ? product.getCategory().getName() : null
        );
    }
}
