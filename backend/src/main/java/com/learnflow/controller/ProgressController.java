package com.learnflow.controller;

import com.learnflow.dto.ProgressUpdateRequest;
import com.learnflow.model.UserProgress;
import com.learnflow.service.ProgressService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<UserProgress> getProgress(@PathVariable String courseId, Principal principal) {
        return ResponseEntity.ok(progressService.getProgress(courseId, principal.getName()));
    }

    @PatchMapping("/update")
    public ResponseEntity<UserProgress> updateProgress(@Valid @RequestBody ProgressUpdateRequest request, Principal principal) {
        return ResponseEntity.ok(progressService.updateProgress(request, principal.getName()));
    }
}
