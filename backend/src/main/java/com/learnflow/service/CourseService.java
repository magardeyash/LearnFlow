package com.learnflow.service;

import com.learnflow.dto.CourseRequest;
import com.learnflow.exception.CustomExceptions;
import com.learnflow.model.*;
import com.learnflow.repository.CourseRepository;
import com.learnflow.repository.DiscussionRepository;
import com.learnflow.repository.UserRepository;
import com.learnflow.util.AppUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final DiscussionRepository discussionRepository;
    private final MongoTemplate mongoTemplate;

    public CourseService(
            CourseRepository courseRepository,
            UserRepository userRepository,
            DiscussionRepository discussionRepository,
            MongoTemplate mongoTemplate) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.discussionRepository = discussionRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public Course createCourse(CourseRequest request, String instructorEmail) {
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Instructor not found"));

        if (instructor.getRole() != Role.INSTRUCTOR && instructor.getRole() != Role.ADMIN) {
            throw new CustomExceptions.ForbiddenException("Only instructors can create courses");
        }

        String baseSlug = AppUtils.toSlug(request.getTitle());
        String slug = baseSlug;
        int count = 1;
        while (courseRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + count;
            count++;
        }

        Course course = Course.builder()
                .title(request.getTitle())
                .slug(slug)
                .thumbnail(request.getThumbnail() != null ? request.getThumbnail() : "")
                .instructorId(instructor.getId())
                .description(request.getDescription())
                .skills(request.getSkills() != null ? request.getSkills() : List.of())
                .price(request.getPrice())
                .category(request.getCategory())
                .level(request.getLevel())
                .isPublished(request.isPublished())
                .totalEnrolledStudents(0)
                .rating(0.0)
                .build();
        Course savedCourse = courseRepository.save(course);

        // Auto-create discussion board for the course
        Discussion discussion = Discussion.builder()
                .courseId(savedCourse.getId())
                .build();
        discussionRepository.save(discussion);

        return savedCourse;
    }

    public Course updateCourse(String id, CourseRequest request, String instructorEmail) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Course not found"));
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        // Check ownership
        if (!course.getInstructorId().equals(instructor.getId()) && instructor.getRole() != Role.ADMIN) {
            throw new CustomExceptions.ForbiddenException("You do not own this course");
        }

        if (!course.getTitle().equals(request.getTitle())) {
            String baseSlug = AppUtils.toSlug(request.getTitle());
            String slug = baseSlug;
            int count = 1;
            while (courseRepository.findBySlug(slug).isPresent()) {
                slug = baseSlug + "-" + count;
                count++;
            }
            course.setSlug(slug);
            course.setTitle(request.getTitle());
        }

        course.setDescription(request.getDescription());
        course.setThumbnail(request.getThumbnail() != null ? request.getThumbnail() : "");
        course.setSkills(request.getSkills() != null ? request.getSkills() : List.of());
        course.setPrice(request.getPrice());
        course.setCategory(request.getCategory());
        course.setLevel(request.getLevel());
        course.setPublished(request.isPublished());

        return courseRepository.save(course);
    }

    public void deleteCourse(String id, String userEmail) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Course not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        if (!course.getInstructorId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new CustomExceptions.ForbiddenException("You are not authorized to delete this course");
        }

        courseRepository.delete(course);
        
        // Clean up discussion board
        discussionRepository.findByCourseId(id).ifPresent(discussionRepository::delete);
    }

    public List<Course> getCourses(String search, String category, Level level, Double maxPrice) {
        Query query = new Query();
        query.addCriteria(Criteria.where("isPublished").is(true));

        if (category != null && !category.trim().isEmpty()) {
            query.addCriteria(Criteria.where("category").is(category.trim()));
        }
        if (level != null) {
            query.addCriteria(Criteria.where("level").is(level));
        }
        if (maxPrice != null) {
            query.addCriteria(Criteria.where("price").lte(maxPrice));
        }
        if (search != null && !search.trim().isEmpty()) {
            String searchPattern = search.trim();
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("title").regex(searchPattern, "i"),
                    Criteria.where("description").regex(searchPattern, "i")
            ));
        }

        return mongoTemplate.find(query, Course.class);
    }

    public Course getCourseById(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Course not found"));
    }

    public List<Course> getMyCourses(String instructorEmail) {
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Instructor not found"));

        return courseRepository.findByInstructorId(instructor.getId());
    }
}
