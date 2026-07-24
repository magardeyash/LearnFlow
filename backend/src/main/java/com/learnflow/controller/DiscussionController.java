package com.learnflow.controller;

import com.learnflow.dto.MessageRequest;
import com.learnflow.model.Message;
import com.learnflow.service.DiscussionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/discussions")
public class DiscussionController {

    private final DiscussionService discussionService;

    public DiscussionController(DiscussionService discussionService) {
        this.discussionService = discussionService;
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String courseId, Principal principal) {
        return ResponseEntity.ok(discussionService.getDiscussionMessages(courseId, principal.getName()));
    }

    @PostMapping("/{courseId}")
    public ResponseEntity<Message> postMessage(
            @PathVariable String courseId,
            @Valid @RequestBody MessageRequest request,
            Principal principal) {
        return ResponseEntity.ok(discussionService.postMessage(courseId, principal.getName(), request.getMessage()));
    }
}
