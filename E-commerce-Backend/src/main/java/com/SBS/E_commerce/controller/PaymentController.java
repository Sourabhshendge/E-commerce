package com.SBS.E_commerce.controller;

import com.SBS.E_commerce.entity.PaymentOrder;
import com.SBS.E_commerce.service.serviceImpl.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrder> createOrder(@RequestBody Map<String, Object> request) throws RazorpayException {
        String userId = (String) request.get("userId");
        int amount = (int) request.get("amount");
        PaymentOrder order = paymentService.createOrder(userId, amount);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@RequestBody Map<String, String> data) {
        boolean verified = paymentService.verifyAndUpdatePayment(data);
        return verified
                ? ResponseEntity.ok("Payment verified & updated in DB")
                : ResponseEntity.badRequest().body("Payment verification failed");
    }
}

