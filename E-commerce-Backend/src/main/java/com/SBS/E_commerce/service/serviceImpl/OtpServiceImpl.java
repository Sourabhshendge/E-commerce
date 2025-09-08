package com.SBS.E_commerce.service.serviceImpl;


import com.SBS.E_commerce.config.OtpCache;
import com.SBS.E_commerce.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpCache otpCache;
    private final EmailService emailService;
    private final SecureRandom random = new SecureRandom();

    @Override
    public void sendOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        otpCache.storeOtp(email, otp);

        // You can customize the subject and message if you want
        String subject = "Your OTP Code";
        String message = "Your OTP is: " + otp + "\nIt will expire in 5 minutes.";

        // Sending email
        emailService.sendOtpEmail(email, subject, message, otp);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        boolean valid = otpCache.isValid(email, otp);
        if (valid) {
            otpCache.removeOtp(email); // remove OTP after successful verification
        }
        return valid;
    }

    @Override
    public String getOtp(String email) {
        String otp = otpCache.getOtp(email);
        return otpCache.isValid(email, otp) ? otp : null;
    }

}
