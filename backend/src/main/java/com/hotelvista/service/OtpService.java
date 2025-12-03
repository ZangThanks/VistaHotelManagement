package com.hotelvista.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    private final Map<String, String> otpStrore = new ConcurrentHashMap<>();

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStrore.put(email, otp);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        return otp.equals(otpStrore.get(email));
    }
}
