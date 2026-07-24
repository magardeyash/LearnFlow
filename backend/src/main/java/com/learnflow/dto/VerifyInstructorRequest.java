package com.learnflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyInstructorRequest {
    @NotBlank(message = "Instructor ID is required")
    private String instructorId;
}
