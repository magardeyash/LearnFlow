package com.learnflow.controller;

import com.learnflow.dto.QuizRequest;
import com.learnflow.dto.QuizSubmitRequest;
import com.learnflow.model.Quiz;
import com.learnflow.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping
    public ResponseEntity<Quiz> upsertQuiz(@Valid @RequestBody QuizRequest request, Principal principal) {
        return ResponseEntity.ok(quizService.upsertQuiz(request, principal.getName()));
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<Quiz> getQuizByLesson(@PathVariable String lessonId, Principal principal) {
        return ResponseEntity.ok(quizService.getQuizByLesson(lessonId, principal.getName()));
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitQuiz(@Valid @RequestBody QuizSubmitRequest request, Principal principal) {
        return ResponseEntity.ok(quizService.submitQuiz(request, principal.getName()));
    }
}
