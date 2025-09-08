package com.SBS.E_commerce.repository;

import com.SBS.E_commerce.entity.Cart;
import com.SBS.E_commerce.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, String> {
    void deleteByCartAndProductId(Cart cart, String productId);
}
