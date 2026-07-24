package com.learnflow.service;

import com.learnflow.exception.CustomExceptions;
import com.learnflow.model.*;
import com.learnflow.repository.CourseRepository;
import com.learnflow.repository.DiscussionRepository;
import com.learnflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public DiscussionService(
            DiscussionRepository discussionRepository,
            CourseRepository courseRepository,
            UserRepository userRepository) {
        this.discussionRepository = discussionRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public List<Message> getDiscussionMessages(String courseId, String userEmail) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Course not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        boolean isEnrolled = user.getEnrolledCourses().contains(courseId);
        boolean isOwner = course.getInstructorId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isEnrolled && !isOwner && !isAdmin) {
            throw new CustomExceptions.ForbiddenException("You must be enrolled to view discussion");
        }

        Discussion discussion = discussionRepository.findByCourseId(courseId)
                .orElseGet(() -> discussionRepository.save(Discussion.builder().courseId(courseId).build()));

        return discussion.getMessages();
    }

    public Message postMessage(String courseId, String userEmail, String messageText) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Course not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        boolean isEnrolled = user.getEnrolledCourses().contains(courseId);
        boolean isOwner = course.getInstructorId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isEnrolled && !isOwner && !isAdmin) {
            throw new CustomExceptions.ForbiddenException("You must be enrolled to post a message");
        }

        Discussion discussion = discussionRepository.findByCourseId(courseId)
                .orElseGet(() -> discussionRepository.save(Discussion.builder().courseId(courseId).build()));

        Message message = Message.builder()
                .userId(user.getId())
                .username(user.getName())
                .message(messageText)
                .createdAt(Instant.now())
                .build();

        discussion.getMessages().add(message);
        discussionRepository.save(discussion);

        return message;
    }
}
