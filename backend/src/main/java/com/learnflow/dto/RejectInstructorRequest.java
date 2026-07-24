package com.learnflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectInstructorRequest {
    @NotBlank(message = "Instructor ID is required")
    private String instructorId;
    
    @NotBlank(message = "Rejection reason is required")
    private String reason;
}
