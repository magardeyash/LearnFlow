package com.learnflow.repository;

import com.learnflow.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    Optional<Quiz> findByLessonId(String lessonId);
}
