package com.SBS.E_commerce.repository;

import com.SBS.E_commerce.entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, String> {
    Optional<PaymentOrder> findByRazorpayOrderId(String razorpayOrderId);
}
