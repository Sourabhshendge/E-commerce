package com.SBS.E_commerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String razorpayOrderId;   // From Razorpay API
    private String paymentId;         // Filled after success
    private String userId;            // Who is paying
    private Integer amount;           // Amount in paise
    private String currency;
    private String status;            // CREATED, PAID, FAILED, CANCELLED
    private LocalDateTime createdAt = LocalDateTime.now();
}
