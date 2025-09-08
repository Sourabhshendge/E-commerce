package com.SBS.E_commerce.service.serviceImpl;

import com.SBS.E_commerce.dto.CartItemResponseDTO;
import com.SBS.E_commerce.dto.CartRequestDTO;
import com.SBS.E_commerce.dto.CartResponseDTO;
import com.SBS.E_commerce.dto.ProductResponseDTO;
import com.SBS.E_commerce.entity.Cart;
import com.SBS.E_commerce.entity.CartItem;
import com.SBS.E_commerce.entity.Product;
import com.SBS.E_commerce.entity.ProductImage;
import com.SBS.E_commerce.exception.ResourceNotFoundException;
import com.SBS.E_commerce.repository.CartItemRepository;
import com.SBS.E_commerce.repository.CartRepository;
import com.SBS.E_commerce.repository.ProductRepository;
import com.SBS.E_commerce.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           CartItemRepository cartItemRepository,
                           ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    // ----------------- ADD TO CART -----------------
    @Override
    @CachePut(value = "userCart", key = "#request.userId", unless = "#result == null")
    public CartResponseDTO addToCart(CartRequestDTO request) {
        Cart cart = cartRepository.findByUserId(request.getUserId())
                .orElseGet(() -> Cart.builder()
                        .id(UUID.randomUUID().toString())
                        .userId(request.getUserId())
                        .build());

        boolean exists = false;
        for (CartItem item : cart.getItems()) {
            if (item.getProductId().equals(request.getProductId())) {
                item.setQuantity(item.getQuantity() + request.getQuantity());
                exists = true;
                break;
            }
        }

        if (!exists) {
            CartItem newItem = CartItem.builder()
                    .cartItemId(UUID.randomUUID().toString())
                    .cart(cart)
                    .productId(request.getProductId())
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
        }

        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponseDTO(savedCart);
    }

    // ----------------- GET CART -----------------
    @Override
    @Cacheable(value = "userCart", key = "#userId", unless = "#result == null")
    public CartResponseDTO getCartByUser(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user " + userId));
        return mapToCartResponseDTO(cart);
    }

    // ----------------- REMOVE FROM CART -----------------
    @Override
    @CachePut(value = "userCart", key = "#userId", unless = "#result == null")
    public CartResponseDTO removeFromCart(String userId, String productId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user " + userId));

        cart.getItems().removeIf(item -> item.getProductId().equals(productId));

        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponseDTO(savedCart);
    }

    // ------------------- Helper Mapper -------------------
    private CartResponseDTO mapToCartResponseDTO(Cart cart) {
        List<CartItemResponseDTO> items = cart.getItems().stream()
                .map(item -> {
                    Product product = productRepository.findById(item.getProductId())
                            .orElseThrow(() -> new ResourceNotFoundException("Product not found " + item.getProductId()));

                    ProductResponseDTO productDTO = ProductResponseDTO.builder()
                            .productId(product.getProductId())
                            .name(product.getName())
                            .description(product.getDescription())
                            .price(product.getPrice())
                            .stock(product.getStock())
                            .categoryName(product.getCategory().getName())
                            .imageUrls(product.getImages().stream()
                                    .map(ProductImage::getUrl)
                                    .toList())
                            .build();

                    return CartItemResponseDTO.builder()
                            .cartItemId(item.getCartItemId())
                            .quantity(item.getQuantity())
                            .product(productDTO)
                            .build();
                })
                .toList();

        return CartResponseDTO.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(items)
                .build();
    }
}

