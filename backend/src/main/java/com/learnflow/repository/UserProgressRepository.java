package com.learnflow.repository;

import com.learnflow.model.UserProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserProgressRepository extends MongoRepository<UserProgress, String> {
    Optional<UserProgress> findByCourseIdAndUserId(String courseId, String userId);
}
