package com.SBS.E_commerce.service.serviceImpl;

import com.SBS.E_commerce.dto.OrderItemResponseDTO;
import com.SBS.E_commerce.dto.OrderResponseDTO;
import com.SBS.E_commerce.dto.ProductResponseDTO;
import com.SBS.E_commerce.entity.*;
import com.SBS.E_commerce.exception.ResourceNotFoundException;
import com.SBS.E_commerce.repository.CartRepository;
import com.SBS.E_commerce.repository.OrderRepository;
import com.SBS.E_commerce.repository.ProductRepository;
import com.SBS.E_commerce.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    @CacheEvict(value = "userOrders", key = "#userId") // only evict user orders
    public OrderResponseDTO placeOrder(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found " + userId));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty!");
        }

        Order order = Order.builder()
                .orderId(UUID.randomUUID().toString())
                .userId(userId)
                .status(OrderStatus.PENDING)
                .build();

        double total = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cart.getItems()) {
            Product product = productRepository.findById(ci.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found " + ci.getProductId()));

            double itemTotal = product.getPrice() * ci.getQuantity();
            total += itemTotal;

            orderItems.add(OrderItem.builder()
                    .orderItemId(UUID.randomUUID().toString())
                    .order(order)
                    .productId(product.getProductId())
                    .quantity(ci.getQuantity())
                    .price(product.getPrice())
                    .build());
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cartRepository.delete(cart);

        return mapToOrderResponseDTO(savedOrder);
    }


    @Override
    @Cacheable(value = "order", key = "#orderId")
    public OrderResponseDTO getOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return mapToOrderResponseDTO(order);
    }

    @Override
    @Cacheable(value = "userOrders", key = "#userId")
    public List<OrderResponseDTO> getOrdersByUser(String userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToOrderResponseDTO)
                .toList();
    }

    @Override
    @CachePut(value = "order", key = "#orderId") // update order cache
    @CacheEvict(value = "userOrders", key = "#result.userId") // clear user orders cache
    public OrderResponseDTO cancelOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found " + orderId));

        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Cannot cancel order. It is already " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order updated = orderRepository.save(order);

        return mapToOrderResponseDTO(updated);
    }

    private OrderResponseDTO mapToOrderResponseDTO(Order order) {
        if (order == null) throw new IllegalStateException("Order is null");
        if (order.getOrderId() == null) throw new IllegalStateException("Order ID is null");
        if (order.getUserId() == null) throw new IllegalStateException("User ID is null");
        if (order.getTotalAmount() == null) throw new IllegalStateException("Total amount is null");
        if (order.getStatus() == null) throw new IllegalStateException("Order status is null");
        if (order.getItems() == null) throw new IllegalStateException("Order items list is null");

        List<OrderItemResponseDTO> items = order.getItems().stream()
                .map(oi -> {
                    if (oi.getProductId() == null) throw new IllegalStateException("OrderItem productId is null");
                    if (oi.getQuantity() == 0) throw new IllegalStateException("OrderItem quantity is zero");
                    if (oi.getPrice() == null) throw new IllegalStateException("OrderItem price is null");

                    Product product = productRepository.findById(oi.getProductId())
                            .orElseThrow(() -> new ResourceNotFoundException("Product not found " + oi.getProductId()));

                    if (product.getProductId() == null) throw new IllegalStateException("Product ID is null");
                    if (product.getName() == null) throw new IllegalStateException("Product name is null");
                    if (product.getPrice() == null) throw new IllegalStateException("Product price is null");
                    if (product.getCategory() == null || product.getCategory().getName() == null) throw new IllegalStateException("Product category or category name is null");
                    if (product.getImages() == null) throw new IllegalStateException("Product images list is null");

                    ProductResponseDTO productDTO = ProductResponseDTO.builder()
                            .productId(product.getProductId())
                            .name(product.getName())
                            .description(product.getDescription())
                            .price(product.getPrice())
                            .stock(product.getStock())
                            .categoryName(product.getCategory().getName())
                            .imageUrls(product.getImages().stream()
                                    .map(img -> {
                                        if (img.getUrl() == null) throw new IllegalStateException("Product image URL is null");
                                        return img.getUrl();
                                    })
                                    .toList())
                            .build();

                    return OrderItemResponseDTO.builder()
                            .product(productDTO)
                            .quantity(oi.getQuantity())
                            .price(oi.getPrice())
                            .build();
                }).toList();

        return OrderResponseDTO.builder()
                .orderId(order.getOrderId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .items(items)
                .build();
    }
}
