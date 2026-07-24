package com.learnflow.controller;

import com.learnflow.dto.PaymentOrderRequest;
import com.learnflow.dto.PaymentVerifyRequest;
import com.learnflow.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@Valid @RequestBody PaymentOrderRequest request, Principal principal) {
        return ResponseEntity.ok(paymentService.createOrder(request.getCourseId(), principal.getName()));
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyPayment(@Valid @RequestBody PaymentVerifyRequest request, Principal principal) {
        paymentService.verifyPayment(request, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Payment verified and course enrollment successful"));
    }
}
