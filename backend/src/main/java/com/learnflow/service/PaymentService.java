package com.learnflow.service;

import com.learnflow.dto.PaymentVerifyRequest;
import com.learnflow.exception.CustomExceptions;
import com.learnflow.model.*;
import com.learnflow.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public PaymentService(
            PaymentRepository paymentRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            CartRepository cartRepository) {
        this.paymentRepository = paymentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    public Map<String, Object> createOrder(String courseId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Course not found"));

        if (user.getEnrolledCourses().contains(courseId)) {
            throw new CustomExceptions.BadRequestException("You are already enrolled in this course");
        }

        // Amount in paisa
        long amountInPaisa = Math.round(course.getPrice() * 100);

        // Call Razorpay API
        String url = "https://api.razorpay.com/v1/orders";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String auth = keyId + ":" + keySecret;
        byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.US_ASCII));
        headers.set("Authorization", "Basic " + new String(encodedAuth));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("amount", amountInPaisa);
        requestBody.put("currency", "INR");
        requestBody.put("receipt", "receipt_course_" + courseId + "_" + System.currentTimeMillis());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                String orderId = (String) body.get("id");

                // Save Payment record in DB
                Payment payment = Payment.builder()
                        .userId(user.getId())
                        .courseId(courseId)
                        .price(course.getPrice())
                        .orderId(orderId)
                        .status(PaymentStatus.CREATED)
                        .build();
                paymentRepository.save(payment);

                return body;
            } else {
                throw new CustomExceptions.BadRequestException("Failed to create order on Razorpay");
            }
        } catch (Exception e) {
            throw new CustomExceptions.BadRequestException("Razorpay checkout failed: " + e.getMessage());
        }
    }

    public void verifyPayment(PaymentVerifyRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Course not found"));
        Payment payment = paymentRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Payment record not found for Order ID"));

        // Verify Signature
        String payload = request.getOrderId() + "|" + request.getPaymentId();
        String generatedSignature = "";
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : rawHmac) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            generatedSignature = hexString.toString();
        } catch (Exception e) {
            throw new CustomExceptions.BadRequestException("Signature hashing failed");
        }

        if (!generatedSignature.equals(request.getSignature())) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new CustomExceptions.BadRequestException("Invalid payment signature");
        }

        // Complete Payment
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaymentId(request.getPaymentId());
        paymentRepository.save(payment);

        // Enroll Student
        if (!user.getEnrolledCourses().contains(request.getCourseId())) {
            user.getEnrolledCourses().add(request.getCourseId());
            userRepository.save(user);

            course.setTotalEnrolledStudents(course.getTotalEnrolledStudents() + 1);
            courseRepository.save(course);
        }

        // Clean Cart
        cartRepository.findByUserId(user.getId()).ifPresent(cart -> {
            if (cart.getCourseIds().contains(request.getCourseId())) {
                cart.getCourseIds().remove(request.getCourseId());
                cartRepository.save(cart);
            }
        });
    }
}
