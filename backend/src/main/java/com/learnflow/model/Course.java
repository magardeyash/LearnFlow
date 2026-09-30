package com.learnflow.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "courses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    private String id;
    
    private String title;
    
    @Indexed(unique = true)
    private String slug;
    
    private String thumbnail;
    
    private String instructorId;
    
    private String description;
    
    @Builder.Default
    private List<String> skills = new ArrayList<>();
    
    @Builder.Default
    private List<String> lessonIds = new ArrayList<>();
    
    private double price;
    
    @Builder.Default
    private int totalEnrolledStudents = 0;
    
    private String category;
    
    private Level level;
    
    @Builder.Default
    @org.springframework.data.mongodb.core.mapping.Field("isPublished")
    @com.fasterxml.jackson.annotation.JsonProperty("isPublished")
    private boolean isPublished = false;

    public boolean isPublished() {
        return this.isPublished;
    }

    public void setPublished(boolean isPublished) {
        this.isPublished = isPublished;
    }
    
    @Builder.Default
    private double rating = 0.0;
    
    @CreatedDate
    private Instant createdAt;
    
    @LastModifiedDate
    private Instant updatedAt;
}
