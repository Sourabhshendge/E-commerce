package com.SBS.E_commerce.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor          // ✅ required by JPA
@AllArgsConstructor         // ✅ good for testing & builder
@Builder
public class CartItem {

    @Id
    private String cartItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @Column(nullable = false)
    private String productId;

    @Column(nullable = false)
    private int quantity;
}
