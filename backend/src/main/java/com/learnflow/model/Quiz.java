package com.learnflow.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "quizzes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {
    @Id
    private String id;
    
    private String lessonId;
    
    @Builder.Default
    private List<Mcq> mcqs = new ArrayList<>();
    
    @Builder.Default
    private List<TheoryQuestion> theoryQuestions = new ArrayList<>();
    
    @CreatedDate
    private Instant createdAt;
}
