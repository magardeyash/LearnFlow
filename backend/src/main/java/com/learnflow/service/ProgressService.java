package com.learnflow.service;

import com.learnflow.dto.ProgressUpdateRequest;
import com.learnflow.exception.CustomExceptions;
import com.learnflow.model.*;
import com.learnflow.repository.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressService {

    private final UserProgressRepository userProgressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    public ProgressService(
            UserProgressRepository userProgressRepository,
            LessonRepository lessonRepository,
            UserRepository userRepository) {
        this.userProgressRepository = userProgressRepository;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
    }

    public UserProgress getProgress(String courseId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        return userProgressRepository.findByCourseIdAndUserId(courseId, user.getId())
                .orElseGet(() -> userProgressRepository.save(UserProgress.builder()
                        .courseId(courseId)
                        .userId(user.getId())
                        .build()));
    }

    public UserProgress updateProgress(ProgressUpdateRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        UserProgress progress = userProgressRepository.findByCourseIdAndUserId(request.getCourseId(), user.getId())
                .orElse(UserProgress.builder()
                        .courseId(request.getCourseId())
                        .userId(user.getId())
                        .build());

        Optional<LessonProgress> lpOpt = progress.getProgress().stream()
                .filter(lp -> lp.getLessonId().equals(request.getLessonId()))
                .findFirst();

        if (lpOpt.isPresent()) {
            LessonProgress lp = lpOpt.get();
            lp.setVideoWatched(request.isVideoWatched());
            lp.setNotesDownloaded(request.isNotesDownloaded());
            if (request.getQuizScore() != null) {
                lp.setQuizScore(request.getQuizScore());
            }
        } else {
            progress.getProgress().add(LessonProgress.builder()
                    .lessonId(request.getLessonId())
                    .videoWatched(request.isVideoWatched())
                    .notesDownloaded(request.isNotesDownloaded())
                    .quizScore(request.getQuizScore() != null ? request.getQuizScore() : -1)
                    .build());
        }

        // Check if course is fully completed
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderAsc(request.getCourseId());
        long completedLessonsCount = progress.getProgress().stream()
                .filter(LessonProgress::isVideoWatched)
                .count();

        if (lessons.size() > 0 && completedLessonsCount == lessons.size()) {
            if (progress.getCompletedAt() == null) {
                progress.setCompletedAt(Instant.now());
            }
        } else {
            progress.setCompletedAt(null);
        }

        return userProgressRepository.save(progress);
    }
}
