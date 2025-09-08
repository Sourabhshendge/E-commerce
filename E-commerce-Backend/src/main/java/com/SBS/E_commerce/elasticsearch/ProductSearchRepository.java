package com.SBS.E_commerce.elasticsearch;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSearchRepository extends ElasticsearchRepository<ProductIndex, String> {
    List<ProductIndex> findByNameContainingIgnoreCase(String name);
    List<ProductIndex> findByCategory(String category);     // filter search
}
