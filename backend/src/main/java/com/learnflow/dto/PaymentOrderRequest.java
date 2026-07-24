package com.learnflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentOrderRequest {
    @NotBlank(message = "Course ID is required")
    private String courseId;
}
