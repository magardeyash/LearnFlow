package com.learnflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProgressUpdateRequest {
    @NotBlank(message = "Course ID is required")
    private String courseId;
    
    @NotBlank(message = "Lesson ID is required")
    private String lessonId;
    
    private boolean videoWatched;
    
    private Integer quizScore;
    
    private boolean notesDownloaded;
}
