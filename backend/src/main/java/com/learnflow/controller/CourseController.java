package com.learnflow.controller;

import com.learnflow.dto.CourseRequest;
import com.learnflow.model.Course;
import com.learnflow.model.Level;
import com.learnflow.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<Course>> getCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Level level,
            @RequestParam(required = false) Double maxPrice) {
        return ResponseEntity.ok(courseService.getCourses(search, category, level, maxPrice));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@Valid @RequestBody CourseRequest request, Principal principal) {
        return ResponseEntity.ok(courseService.createCourse(request, principal.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable String id,
            @Valid @RequestBody CourseRequest request,
            Principal principal) {
        return ResponseEntity.ok(courseService.updateCourse(id, request, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCourse(@PathVariable String id, Principal principal) {
        courseService.deleteCourse(id, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Course deleted successfully"));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Course>> getMyCourses(Principal principal) {
        return ResponseEntity.ok(courseService.getMyCourses(principal.getName()));
    }
}
