package com.learnflow.repository;

import com.learnflow.model.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LessonRepository extends MongoRepository<Lesson, String> {
    List<Lesson> findByCourseIdOrderByOrderAsc(String courseId);
}
