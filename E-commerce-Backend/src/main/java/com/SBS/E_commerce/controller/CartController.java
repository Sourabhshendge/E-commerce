package com.SBS.E_commerce.controller;

import com.SBS.E_commerce.dto.ApiResponse;
import com.SBS.E_commerce.dto.CartRequestDTO;
import com.SBS.E_commerce.dto.CartResponseDTO;
import com.SBS.E_commerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponseDTO>> addToCart(@RequestBody CartRequestDTO request) {
        CartResponseDTO response = cartService.addToCart(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product added to cart successfully", response));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<CartResponseDTO>> getCart(@PathVariable String userId) {
        CartResponseDTO response = cartService.getCartByUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart fetched successfully", response));
    }


    @DeleteMapping("/remove/{userId}/{productId}")
    public ResponseEntity<ApiResponse<CartResponseDTO>> removeFromCart(
            @PathVariable String userId,
            @PathVariable String productId) {

        CartResponseDTO updatedCart = cartService.removeFromCart(userId, productId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Product removed from cart successfully", updatedCart)
        );
    }

}

