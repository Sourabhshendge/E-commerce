package com.SBS.E_commerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "liked_products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LikedProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "product_id", nullable = false)
    private String productId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
