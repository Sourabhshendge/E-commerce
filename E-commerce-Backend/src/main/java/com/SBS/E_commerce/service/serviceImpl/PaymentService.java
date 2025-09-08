package com.SBS.E_commerce.service.serviceImpl;

import com.SBS.E_commerce.entity.PaymentOrder;
import com.SBS.E_commerce.exception.ResourceNotFoundException;
import com.SBS.E_commerce.repository.PaymentOrderRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final PaymentOrderRepository repository;

    public PaymentService(PaymentOrderRepository repository) throws RazorpayException {
        this.razorpayClient = new RazorpayClient("rzp_test_RB4vopWfCS41ot", "jZ4agzAHnI50ENXmELTuKT31");
        this.repository = repository;
    }

    public PaymentOrder createOrder(String userId, int amount) throws RazorpayException {
        JSONObject options = new JSONObject();
        options.put("amount", amount * 100); // in paise
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        Order razorpayOrder = razorpayClient.orders.create(options);

        // Save to DB
        PaymentOrder order = new PaymentOrder();
        order.setRazorpayOrderId(razorpayOrder.get("id"));
        order.setUserId(userId);
        order.setAmount(amount * 100);
        order.setCurrency("INR");
        order.setStatus("CREATED");

        return repository.save(order);
    }

    public boolean verifyAndUpdatePayment(Map<String, String> data) {
        String orderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            boolean verified = Utils.verifyPaymentSignature(options, "jZ4agzAHnI50ENXmELTuKT31");

            PaymentOrder order = repository.findByRazorpayOrderId(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

            if (verified) {
                order.setPaymentId(paymentId);
                order.setStatus("PAID");
            } else {
                order.setStatus("FAILED");
            }
            repository.save(order);

            return verified;
        } catch (Exception e) {
            return false;
        }
    }

}


