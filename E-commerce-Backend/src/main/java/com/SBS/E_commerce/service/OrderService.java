package com.SBS.E_commerce.service;

import com.SBS.E_commerce.dto.OrderResponseDTO;

import java.util.List;

public interface OrderService {
    OrderResponseDTO placeOrder(String userId);
    OrderResponseDTO getOrder(String orderId);
    List<OrderResponseDTO> getOrdersByUser(String userId);
    OrderResponseDTO cancelOrder(String orderId);
}
