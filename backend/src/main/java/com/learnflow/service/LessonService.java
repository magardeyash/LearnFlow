package com.learnflow.service;

import com.learnflow.dto.LessonRequest;
import com.learnflow.exception.CustomExceptions;
import com.learnflow.model.*;
import com.learnflow.repository.CourseRepository;
import com.learnflow.repository.LessonRepository;
import com.learnflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public LessonService(
            LessonRepository lessonRepository,
            CourseRepository courseRepository,
            UserRepository userRepository) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public Lesson addLesson(LessonRequest request, String instructorEmail) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Course not found"));
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Instructor not found"));

        if (!course.getInstructorId().equals(instructor.getId()) && instructor.getRole() != Role.ADMIN) {
            throw new CustomExceptions.ForbiddenException("You do not own this course");
        }

        Lesson lesson = Lesson.builder()
                .courseId(request.getCourseId())
                .title(request.getTitle())
                .videoUrl(request.getVideoUrl())
                .notesUrl(request.getNotesUrl() != null ? request.getNotesUrl() : "")
                .description(request.getDescription())
                .duration(request.getDuration())
                .order(request.getOrder())
                .isFree(request.isFree())
                .build();
        Lesson savedLesson = lessonRepository.save(lesson);

        course.getLessonIds().add(savedLesson.getId());
        courseRepository.save(course);

        return savedLesson;
    }

    public List<Lesson> getLessonsForCourse(String courseId, String userEmail) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Course not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        boolean isEnrolled = user.getEnrolledCourses().contains(courseId);
        boolean isOwner = course.getInstructorId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isEnrolled && !isOwner && !isAdmin) {
            throw new CustomExceptions.ForbiddenException("You are not enrolled in this course");
        }

        return lessonRepository.findByCourseIdOrderByOrderAsc(courseId);
    }

    public Lesson updateLesson(String id, LessonRequest request, String instructorEmail) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Lesson not found"));
        Course course = courseRepository.findById(lesson.getCourseId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Associated course not found"));
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        if (!course.getInstructorId().equals(instructor.getId()) && instructor.getRole() != Role.ADMIN) {
            throw new CustomExceptions.ForbiddenException("You do not own this course");
        }

        lesson.setTitle(request.getTitle());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setNotesUrl(request.getNotesUrl() != null ? request.getNotesUrl() : "");
        lesson.setDescription(request.getDescription());
        lesson.setDuration(request.getDuration());
        lesson.setOrder(request.getOrder());
        lesson.setFree(request.isFree());

        return lessonRepository.save(lesson);
    }

    public void deleteLesson(String id, String instructorEmail) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Lesson not found"));
        Course course = courseRepository.findById(lesson.getCourseId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Associated course not found"));
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        if (!course.getInstructorId().equals(instructor.getId()) && instructor.getRole() != Role.ADMIN) {
            throw new CustomExceptions.ForbiddenException("You do not own this course");
        }

        lessonRepository.delete(lesson);

        course.getLessonIds().remove(id);
        courseRepository.save(course);
    }
}
