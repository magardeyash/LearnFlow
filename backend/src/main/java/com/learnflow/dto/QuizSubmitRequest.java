package com.learnflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class QuizSubmitRequest {
    @NotBlank(message = "Lesson ID is required")
    private String lessonId;
    
    @NotNull(message = "MCQ Answers list is required")
    private List<Integer> mcqAnswers;
}
