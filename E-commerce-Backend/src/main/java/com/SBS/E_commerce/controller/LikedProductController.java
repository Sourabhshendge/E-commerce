package com.SBS.E_commerce.controller;

import com.SBS.E_commerce.dto.ProductResponseDTO;
import com.SBS.E_commerce.entity.LikedProduct;
import com.SBS.E_commerce.service.serviceImpl.LikedProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikedProductController {

    @Autowired
    private LikedProductService service;

    @PostMapping("/like")
    public ResponseEntity<String> likeProduct(@RequestParam String userId, @RequestParam String productId) {
        service.likeProduct(userId, productId);
        return ResponseEntity.ok("Product liked");
    }

    @DeleteMapping("/dislike")
    public ResponseEntity<String> dislikeProduct(@RequestParam String userId, @RequestParam String productId) {
        service.dislikeProduct(userId, productId);
        return ResponseEntity.ok("Product disliked");
    }

    @GetMapping("/list")
    public ResponseEntity<List<ProductResponseDTO>> getLikedProducts(@RequestParam String userId) {
        return ResponseEntity.ok(service.getLikedProducts(userId));
    }
}
