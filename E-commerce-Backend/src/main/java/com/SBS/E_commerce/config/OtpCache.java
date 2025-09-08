package com.SBS.E_commerce.config;


import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OtpCache {
    private final Map<String, String> otpMap = new ConcurrentHashMap<>();
    private final Map<String, Long> expiryMap = new ConcurrentHashMap<>();
    private static final long OTP_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes

    public void storeOtp(String email, String otp) {
        otpMap.put(email, otp);
        expiryMap.put(email, System.currentTimeMillis() + OTP_VALIDITY_MS);
    }

    public boolean isValid(String email, String otp) {
        return otp.equals(otpMap.get(email)) && System.currentTimeMillis() < expiryMap.getOrDefault(email, 0L);
    }

    public void removeOtp(String email) {
        otpMap.remove(email);
        expiryMap.remove(email);
    }

    public String getOtp(String email) {
        return otpMap.get(email);
    }
}

