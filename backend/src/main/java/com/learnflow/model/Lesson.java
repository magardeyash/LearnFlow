package com.learnflow.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "lessons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {
    @Id
    private String id;
    
    private String courseId;
    
    private String title;
    
    private String videoUrl;
    
    private String notesUrl;
    
    private String quizId; // nullable
    
    private String description;
    
    private int duration; // in minutes
    
    private int order;
    
    @org.springframework.data.mongodb.core.mapping.Field("isFree")
    @com.fasterxml.jackson.annotation.JsonProperty("isFree")
    private boolean isFree;

    public boolean isFree() {
        return this.isFree;
    }

    public void setFree(boolean isFree) {
        this.isFree = isFree;
    }
    
    @CreatedDate
    private Instant createdAt;
}
