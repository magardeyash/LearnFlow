package com.learnflow.dto;

import com.learnflow.model.Mcq;
import com.learnflow.model.TheoryQuestion;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class QuizRequest {
    @NotBlank(message = "Lesson ID is required")
    private String lessonId;
    
    private List<Mcq> mcqs;
    
    private List<TheoryQuestion> theoryQuestions;
}
