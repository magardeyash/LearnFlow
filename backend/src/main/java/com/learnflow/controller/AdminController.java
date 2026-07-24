package com.learnflow.controller;

import com.learnflow.dto.RejectInstructorRequest;
import com.learnflow.dto.VerifyInstructorRequest;
import com.learnflow.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests() {
        return ResponseEntity.ok(adminService.getPendingRequests());
    }

    @PostMapping("/verify-instructor")
    public ResponseEntity<Map<String, String>> verifyInstructor(@Valid @RequestBody VerifyInstructorRequest request) {
        adminService.verifyInstructor(request.getInstructorId());
        return ResponseEntity.ok(Map.of("message", "Instructor request approved successfully"));
    }

    @PostMapping("/reject-instructor")
    public ResponseEntity<Map<String, String>> rejectInstructor(@Valid @RequestBody RejectInstructorRequest request) {
        adminService.rejectInstructor(request.getInstructorId(), request.getReason());
        return ResponseEntity.ok(Map.of("message", "Instructor request rejected successfully"));
    }
}
