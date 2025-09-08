package com.SBS.E_commerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartRequestDTO {
    private String userId;
    private String productId;
    private int quantity;
}

