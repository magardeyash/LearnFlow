package com.learnflow.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "otps")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Otp {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String codeHash;
    
    private Instant expiresAt;
    
    @Builder.Default
    private int attempts = 5;
    
    @Indexed(expireAfterSeconds = 900)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
