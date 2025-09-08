package com.SBS.E_commerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    @Id
    private String orderItemId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private String productId;
    private int quantity;
    private Double price; // snapshot of price
}

