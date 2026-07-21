package com.learnflow.repository;

import com.learnflow.model.Discussion;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface DiscussionRepository extends MongoRepository<Discussion, String> {
    Optional<Discussion> findByCourseId(String courseId);
}
