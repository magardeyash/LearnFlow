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

        boolean hasFullAccess = false;
        if (userEmail != null) {
            java.util.Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                hasFullAccess = user.getEnrolledCourses().contains(courseId)
                        || course.getInstructorId().equals(user.getId())
                        || user.getRole() == Role.ADMIN;
            }
        }

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderAsc(courseId);
        if (hasFullAccess) {
            return lessons;
        }

        // Return syllabus for preview: keep videoUrl only for free preview lessons, mask for locked lessons
        return lessons.stream().map(l -> {
            if (l.isFree()) {
                return l;
            }
            return Lesson.builder()
                    .id(l.getId())
                    .courseId(l.getCourseId())
                    .title(l.getTitle())
                    .description(l.getDescription())
                    .duration(l.getDuration())
                    .order(l.getOrder())
                    .isFree(false)
                    .videoUrl("")
                    .notesUrl("")
                    .quizId(null)
                    .createdAt(l.getCreatedAt())
                    .build();
        }).toList();
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
