package com.learnflow.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "pending_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingRequest {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String instructorId;
    
    private String resumeUrl;
    
    private String idProofUrl;
    
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;
    
    @CreatedDate
    private Instant createdAt;
}
