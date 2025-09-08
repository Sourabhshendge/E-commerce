package com.SBS.E_commerce.controller;

import com.SBS.E_commerce.dto.ProductResponseDTO;
import com.SBS.E_commerce.elasticsearch.ProductIndex;
import com.SBS.E_commerce.elasticsearch.ProductSearchService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final ProductSearchService service;

    public SearchController(ProductSearchService service) {
        this.service = service;
    }

    @GetMapping("/search")
    public List<ProductResponseDTO> search(@RequestParam String q) {
        return service.smartSearch(q);
    }

    @GetMapping("/category/{category}")
    public List<ProductIndex> filterByCategory(@PathVariable String category) {
        return service.filterByCategory(category);
    }
}

