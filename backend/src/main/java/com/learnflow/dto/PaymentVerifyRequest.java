package com.learnflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentVerifyRequest {
    @NotBlank(message = "Order ID is required")
    private String orderId;
    
    @NotBlank(message = "Payment ID is required")
    private String paymentId;
    
    @NotBlank(message = "Signature is required")
    private String signature;
    
    @NotBlank(message = "Course ID is required")
    private String courseId;
}
