package com.learnflow.controller;

import com.learnflow.dto.*;
import com.learnflow.exception.CustomExceptions;
import com.learnflow.service.AuthService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    
    // Bucket4j rate limiting cache per email address
    private final Map<String, Bucket> rateLimitCache = new ConcurrentHashMap<>();

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    private Bucket resolveBucket(String email) {
        return rateLimitCache.computeIfAbsent(email, key -> {
            // Allow 3 OTP requests every 10 minutes
            Refill refill = Refill.intervally(3, Duration.ofMinutes(10));
            Bandwidth limit = Bandwidth.classic(3, refill);
            return Bucket.builder()
                    .addLimit(limit)
                    .build();
        });
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        Bucket bucket = resolveBucket(request.getEmail());
        if (!bucket.tryConsume(1)) {
            throw new CustomExceptions.TooManyRequestsException("Too many OTP requests. Please wait before trying again.");
        }
        
        authService.sendVerificationOtp(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully to " + request.getEmail()));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request);
        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody SendOtpRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Password reset OTP sent successfully"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(authService.googleLogin(request));
    }

    @PostMapping("/instructor-apply")
    public ResponseEntity<Map<String, String>> applyInstructor(Principal principal, @Valid @RequestBody InstructorApplyRequest request) {
        if (principal == null) {
            throw new CustomExceptions.UnauthorizedException("User is not authenticated");
        }
        authService.applyInstructor(principal.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Instructor application submitted successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse.UserResponse> getMe(Principal principal) {
        if (principal == null) {
            throw new CustomExceptions.UnauthorizedException("User is not authenticated");
        }
        return ResponseEntity.ok(authService.getCurrentUser(principal.getName()));
    }
}
