package com.learnflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InstructorApplyRequest {
    @NotBlank(message = "Resume URL is required")
    private String resumeUrl;
    
    @NotBlank(message = "ID Proof URL is required")
    private String idProofUrl;
}
