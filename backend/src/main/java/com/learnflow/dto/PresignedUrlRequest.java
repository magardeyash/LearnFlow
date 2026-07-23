package com.learnflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PresignedUrlRequest {
    @NotBlank(message = "File name is required")
    private String fileName;
    
    @NotBlank(message = "Content type is required")
    private String contentType;
    
    private String folder; // e.g. "avatars", "courses", "lessons"
}
