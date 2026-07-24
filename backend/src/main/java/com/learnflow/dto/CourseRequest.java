package com.learnflow.dto;

import com.learnflow.model.Level;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.util.List;

@Data
public class CourseRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String thumbnail;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private List<String> skills;
    
    @PositiveOrZero(message = "Price must be zero or positive")
    private double price;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotNull(message = "Course level is required")
    private Level level;
    
    private boolean published;
}
