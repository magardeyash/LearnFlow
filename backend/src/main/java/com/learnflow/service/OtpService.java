package com.learnflow.service;

import com.learnflow.exception.CustomExceptions;
import com.learnflow.model.Otp;
import com.learnflow.repository.OtpRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;

@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom random = new SecureRandom();

    public OtpService(OtpRepository otpRepository, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public void generateAndSendOtp(String email, boolean isReset) {
        String code = String.format("%06d", random.nextInt(1000000));
        String hashedCode = passwordEncoder.encode(code);

        otpRepository.findByEmail(email).ifPresent(otpRepository::delete);

        Otp otp = Otp.builder()
                .email(email)
                .codeHash(hashedCode)
                .expiresAt(Instant.now().plusSeconds(600))
                .attempts(5)
                .build();
        otpRepository.save(otp);

        if (isReset) {
            emailService.sendPasswordResetEmail(email, code);
        } else {
            emailService.sendOtpEmail(email, code);
        }
    }

    public void verifyOtp(String email, String rawCode) {
        Otp otp = otpRepository.findByEmail(email)
                .orElseThrow(() -> new CustomExceptions.BadRequestException("No OTP requested for this email"));

        if (otp.getExpiresAt().isBefore(Instant.now())) {
            otpRepository.delete(otp);
            throw new CustomExceptions.BadRequestException("OTP has expired");
        }

        if (otp.getAttempts() <= 0) {
            otpRepository.delete(otp);
            throw new CustomExceptions.BadRequestException("Too many invalid attempts. Please request a new OTP");
        }

        if (passwordEncoder.matches(rawCode, otp.getCodeHash())) {
            otpRepository.delete(otp);
        } else {
            otp.setAttempts(otp.getAttempts() - 1);
            if (otp.getAttempts() <= 0) {
                otpRepository.delete(otp);
                throw new CustomExceptions.BadRequestException("Incorrect OTP. No attempts left. Please request a new OTP");
            } else {
                otpRepository.save(otp);
                throw new CustomExceptions.BadRequestException("Incorrect OTP. " + otp.getAttempts() + " attempts remaining");
            }
        }
    }
}
