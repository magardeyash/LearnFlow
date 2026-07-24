package com.learnflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class LessonRequest {
    @NotBlank(message = "Course ID is required")
    private String courseId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Video URL is required")
    private String videoUrl;
    
    private String notesUrl;
    
    private String description;
    
    @Positive(message = "Duration must be greater than zero")
    private int duration; // in minutes
    
    @NotNull(message = "Order is required")
    private int order;
    
    private boolean isFree;
}
