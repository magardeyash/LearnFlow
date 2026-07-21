package com.learnflow.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "user_progress")
@CompoundIndex(name = "course_user_idx", def = "{'courseId': 1, 'userId': 1}", unique = true)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {
    @Id
    private String id;
    
    private String courseId;
    
    private String userId;
    
    @Builder.Default
    private List<LessonProgress> progress = new ArrayList<>();
    
    private Instant completedAt; // nullable
    
    @CreatedDate
    private Instant createdAt;
}
