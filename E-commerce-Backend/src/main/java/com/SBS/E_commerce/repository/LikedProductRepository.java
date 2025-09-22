package com.SBS.E_commerce.repository;

import com.SBS.E_commerce.entity.LikedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikedProductRepository extends JpaRepository<LikedProduct, Long> {

    List<LikedProduct> findByUserId(String userId);
    Optional<LikedProduct> findByUserIdAndProductId(String userId, String productId);
    void deleteByUserIdAndProductId(String userId, String productId);
}
