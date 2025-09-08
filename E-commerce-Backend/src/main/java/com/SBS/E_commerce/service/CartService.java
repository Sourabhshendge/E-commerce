package com.SBS.E_commerce.service;

import com.SBS.E_commerce.dto.CartRequestDTO;
import com.SBS.E_commerce.dto.CartResponseDTO;

public interface CartService {
    CartResponseDTO addToCart(CartRequestDTO request);
    CartResponseDTO getCartByUser(String userId);
    CartResponseDTO removeFromCart(String userId, String productId);
}

