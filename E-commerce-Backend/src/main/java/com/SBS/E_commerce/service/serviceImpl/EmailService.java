package com.SBS.E_commerce.service.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String subject, String message, String otp) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom("shendgesourabh98@gmail.com");
        email.setTo(to);
        email.setSubject(subject);
        email.setText(message); // message already contains OTP
        mailSender.send(email);
    }

}