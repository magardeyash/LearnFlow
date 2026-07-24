package com.learnflow.service;

import com.learnflow.dto.QuizRequest;
import com.learnflow.dto.QuizSubmitRequest;
import com.learnflow.exception.CustomExceptions;
import com.learnflow.model.*;
import com.learnflow.repository.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;

    public QuizService(
            QuizRepository quizRepository,
            LessonRepository lessonRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            UserProgressRepository userProgressRepository) {
        this.quizRepository = quizRepository;
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.userProgressRepository = userProgressRepository;
    }

    public Quiz upsertQuiz(QuizRequest request, String instructorEmail) {
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Lesson not found"));
        Course course = courseRepository.findById(lesson.getCourseId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Associated course not found"));
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Instructor not found"));

        if (!course.getInstructorId().equals(instructor.getId()) && instructor.getRole() != Role.ADMIN) {
            throw new CustomExceptions.ForbiddenException("You do not own this course");
        }

        Quiz quiz = quizRepository.findByLessonId(request.getLessonId())
                .orElse(Quiz.builder().lessonId(request.getLessonId()).build());

        quiz.setMcqs(request.getMcqs() != null ? request.getMcqs() : quiz.getMcqs());
        quiz.setTheoryQuestions(request.getTheoryQuestions() != null ? request.getTheoryQuestions() : quiz.getTheoryQuestions());
        
        Quiz savedQuiz = quizRepository.save(quiz);

        lesson.setQuizId(savedQuiz.getId());
        lessonRepository.save(lesson);

        return savedQuiz;
    }

    public Quiz getQuizByLesson(String lessonId, String userEmail) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Lesson not found"));
        Course course = courseRepository.findById(lesson.getCourseId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Associated course not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        boolean isEnrolled = user.getEnrolledCourses().contains(course.getId());
        boolean isOwner = course.getInstructorId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isEnrolled && !isOwner && !isAdmin) {
            throw new CustomExceptions.ForbiddenException("You do not have access to this quiz");
        }

        return quizRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Quiz not found for this lesson"));
    }

    public Map<String, Object> submitQuiz(QuizSubmitRequest request, String userEmail) {
        Quiz quiz = quizRepository.findByLessonId(request.getLessonId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Quiz not found"));
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Lesson not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("User not found"));

        if (!user.getEnrolledCourses().contains(lesson.getCourseId()) && user.getRole() != Role.ADMIN) {
            throw new CustomExceptions.ForbiddenException("You must be enrolled to submit a quiz");
        }

        int correctCount = 0;
        int totalMcqs = quiz.getMcqs().size();

        for (int i = 0; i < totalMcqs; i++) {
            if (i < request.getMcqAnswers().size()) {
                int userAns = request.getMcqAnswers().get(i);
                int correctAns = quiz.getMcqs().get(i).getCorrectIndex();
                if (userAns == correctAns) {
                    correctCount++;
                }
            }
        }

        // Update progress
        UserProgress progress = userProgressRepository.findByCourseIdAndUserId(lesson.getCourseId(), user.getId())
                .orElse(UserProgress.builder()
                        .courseId(lesson.getCourseId())
                        .userId(user.getId())
                        .build());

        Optional<LessonProgress> lpOpt = progress.getProgress().stream()
                .filter(lp -> lp.getLessonId().equals(request.getLessonId()))
                .findFirst();

        if (lpOpt.isPresent()) {
            lpOpt.get().setQuizScore(correctCount);
        } else {
            progress.getProgress().add(LessonProgress.builder()
                    .lessonId(request.getLessonId())
                    .quizScore(correctCount)
                    .build());
        }

        userProgressRepository.save(progress);

        Map<String, Object> result = new HashMap<>();
        result.put("score", correctCount);
        result.put("total", totalMcqs);
        result.put("percentage", totalMcqs > 0 ? ((double) correctCount / totalMcqs) * 100 : 0.0);
        return result;
    }
}
