package com.SBS.E_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponseDTO {
    private String orderId;
    private String userId;
    private Double totalAmount;
    private String status;
    private List<OrderItemResponseDTO> items;
}
