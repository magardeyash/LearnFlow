package com.learnflow.controller;

import com.learnflow.dto.LessonRequest;
import com.learnflow.model.Lesson;
import com.learnflow.service.LessonService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @PostMapping
    public ResponseEntity<Lesson> addLesson(@Valid @RequestBody LessonRequest request, Principal principal) {
        return ResponseEntity.ok(lessonService.addLesson(request, principal.getName()));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Lesson>> getLessonsForCourse(@PathVariable String courseId, Principal principal) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(lessonService.getLessonsForCourse(courseId, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lesson> updateLesson(
            @PathVariable String id,
            @Valid @RequestBody LessonRequest request,
            Principal principal) {
        return ResponseEntity.ok(lessonService.updateLesson(id, request, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteLesson(@PathVariable String id, Principal principal) {
        lessonService.deleteLesson(id, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Lesson deleted successfully"));
    }
}
