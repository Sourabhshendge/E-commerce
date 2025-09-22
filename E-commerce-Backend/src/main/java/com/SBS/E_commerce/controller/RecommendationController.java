package com.SBS.E_commerce.controller;

import com.SBS.E_commerce.dto.ProductResponseDTO;
import com.SBS.E_commerce.service.serviceImpl.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/recommend")
    public List<ProductResponseDTO> recommend(@RequestParam String product,
                                              @RequestParam(defaultValue = "5") int topN) {
        return recommendationService.getRecommendations(product, topN);
    }

}
