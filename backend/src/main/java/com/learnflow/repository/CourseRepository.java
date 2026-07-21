package com.learnflow.repository;

import com.learnflow.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByInstructorId(String instructorId);
    List<Course> findByIsPublishedTrue();
    Optional<Course> findBySlug(String slug);
}
