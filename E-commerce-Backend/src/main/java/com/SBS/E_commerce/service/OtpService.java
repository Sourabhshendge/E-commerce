package com.SBS.E_commerce.service;

public interface OtpService {
    void sendOtp(String email);
    boolean verifyOtp(String email, String otp);
    String getOtp(String email);
}