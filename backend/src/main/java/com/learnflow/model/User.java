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

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;
    
    private String name;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    
    @Builder.Default
    private Role role = Role.STUDENT;
    
    @Builder.Default
    @org.springframework.data.mongodb.core.mapping.Field("isVerified")
    @com.fasterxml.jackson.annotation.JsonProperty("isVerified")
    private boolean isVerified = false;

    public boolean isVerified() {
        return this.isVerified;
    }

    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }
    
    @Builder.Default
    private List<String> enrolledCourses = new ArrayList<>();
    
    @Builder.Default
    private String avatar = "";
    
    @CreatedDate
    private Instant createdAt;
    
    @LastModifiedDate
    private Instant updatedAt;
}
