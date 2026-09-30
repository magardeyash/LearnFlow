package com.learnflow.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.learnflow.dto.*;
import com.learnflow.exception.CustomExceptions;
import com.learnflow.model.*;
import com.learnflow.repository.CartRepository;
import com.learnflow.repository.PendingRequestRepository;
import com.learnflow.repository.UserRepository;
import com.learnflow.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PendingRequestRepository pendingRequestRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${google.client.id}")
    private String googleClientId;

    public AuthService(
            UserRepository userRepository,
            CartRepository cartRepository,
            PendingRequestRepository pendingRequestRepository,
            OtpService otpService,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.pendingRequestRepository = pendingRequestRepository;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomExceptions.BadRequestException("Email is already registered");
        }

        Role assignedRole = Role.STUDENT;
        if (request.getRole() != null) {
            try {
                assignedRole = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new CustomExceptions.BadRequestException("Invalid role selected");
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
                .isVerified(false)
                .build();
        userRepository.save(user);

        Cart cart = Cart.builder()
                .userId(user.getId())
                .build();
        cartRepository.save(cart);

        otpService.generateAndSendOtp(user.getEmail(), false);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return buildAuthResponse(token, user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomExceptions.BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomExceptions.BadRequestException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return buildAuthResponse(token, user);
    }

    public void sendVerificationOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));
        if (user.isVerified()) {
            throw new CustomExceptions.BadRequestException("Email is already verified");
        }
        otpService.generateAndSendOtp(email, false);
    }

    public void verifyEmail(VerifyEmailRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));
        
        if (user.isVerified()) {
            throw new CustomExceptions.BadRequestException("Email is already verified");
        }

        otpService.verifyOtp(request.getEmail(), request.getCode());

        user.setVerified(true);
        userRepository.save(user);
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));
        otpService.generateAndSendOtp(email, true);
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        otpService.verifyOtp(request.getEmail(), request.getCode());

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public AuthResponse googleLogin(GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken == null) {
                throw new CustomExceptions.UnauthorizedException("Invalid Google token");
            }

            Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                user = User.builder()
                        .name(name)
                        .email(email)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .role(Role.STUDENT)
                        .isVerified(true)
                        .avatar(pictureUrl != null ? pictureUrl : "")
                        .build();
                userRepository.save(user);

                Cart cart = Cart.builder()
                        .userId(user.getId())
                        .build();
                cartRepository.save(cart);
            } else {
                if (pictureUrl != null && (user.getAvatar() == null || user.getAvatar().isEmpty())) {
                    user.setAvatar(pictureUrl);
                    userRepository.save(user);
                }
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

            return buildAuthResponse(token, user);

        } catch (Exception e) {
            throw new CustomExceptions.UnauthorizedException("Google authentication failed: " + e.getMessage());
        }
    }

    public void applyInstructor(String email, InstructorApplyRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.STUDENT) {
            throw new CustomExceptions.BadRequestException("Only students can apply to become instructors");
        }

        if (pendingRequestRepository.findByInstructorId(user.getId()).isPresent()) {
            throw new CustomExceptions.BadRequestException("An application is already pending or has been processed for this user");
        }

        PendingRequest pendingRequest = PendingRequest.builder()
                .instructorId(user.getId())
                .resumeUrl(request.getResumeUrl())
                .idProofUrl(request.getIdProofUrl())
                .status(RequestStatus.PENDING)
                .build();
        pendingRequestRepository.save(pendingRequest);
    }

    public AuthResponse.UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        return AuthResponse.UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .isVerified(user.isVerified())
                .avatar(user.getAvatar())
                .enrolledCourses(user.getEnrolledCourses() != null ? user.getEnrolledCourses() : java.util.List.of())
                .build();
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        AuthResponse.UserResponse userResponse = AuthResponse.UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .isVerified(user.isVerified())
                .avatar(user.getAvatar())
                .enrolledCourses(user.getEnrolledCourses() != null ? user.getEnrolledCourses() : java.util.List.of())
                .build();

        return AuthResponse.builder()
                .token(token)
                .user(userResponse)
                .build();
    }
}
