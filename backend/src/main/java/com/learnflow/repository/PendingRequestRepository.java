package com.learnflow.repository;

import com.learnflow.model.PendingRequest;
import com.learnflow.model.RequestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface PendingRequestRepository extends MongoRepository<PendingRequest, String> {
    Optional<PendingRequest> findByInstructorId(String instructorId);
    List<PendingRequest> findByStatus(RequestStatus status);
}
