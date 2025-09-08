package com.SBS.E_commerce.controller;

import com.SBS.E_commerce.dto.ApiResponse;
import com.SBS.E_commerce.dto.OrderResponseDTO;
import com.SBS.E_commerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout/{userId}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> placeOrder(@PathVariable String userId) {
        OrderResponseDTO response = orderService.placeOrder(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order placed successfully", response));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Order fetched", orderService.getOrder(orderId)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getUserOrders(@PathVariable String userId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Orders fetched", orderService.getOrdersByUser(userId)));
    }

    @PutMapping("/cancel/{orderId}")   // 👈 Cancel Order
    public ResponseEntity<OrderResponseDTO> cancelOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId));
    }
}
