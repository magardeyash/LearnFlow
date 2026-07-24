package com.learnflow.service;

import com.learnflow.exception.CustomExceptions;
import com.learnflow.model.*;
import com.learnflow.repository.CourseRepository;
import com.learnflow.repository.PaymentRepository;
import com.learnflow.repository.PendingRequestRepository;
import com.learnflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PaymentRepository paymentRepository;
    private final PendingRequestRepository pendingRequestRepository;
    private final EmailService emailService;

    public AdminService(
            UserRepository userRepository,
            CourseRepository courseRepository,
            PaymentRepository paymentRepository,
            PendingRequestRepository pendingRequestRepository,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.paymentRepository = paymentRepository;
        this.pendingRequestRepository = pendingRequestRepository;
        this.emailService = emailService;
    }

    public Map<String, Object> getStats() {
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalInstructors = userRepository.countByRole(Role.INSTRUCTOR);
        long totalCourses = courseRepository.count();
        double totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == PaymentStatus.PAID)
                .mapToDouble(Payment::getPrice)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("totalInstructors", totalInstructors);
        stats.put("totalCourses", totalCourses);
        stats.put("totalRevenue", totalRevenue);
        
        return stats;
    }

    public List<Map<String, Object>> getPendingRequests() {
        List<PendingRequest> requests = pendingRequestRepository.findByStatus(RequestStatus.PENDING);
        
        return requests.stream().map(req -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", req.getId());
            map.put("instructorId", req.getInstructorId());
            map.put("resumeUrl", req.getResumeUrl());
            map.put("idProofUrl", req.getIdProofUrl());
            map.put("status", req.getStatus());
            map.put("createdAt", req.getCreatedAt());
            
            userRepository.findById(req.getInstructorId()).ifPresent(user -> {
                map.put("instructorName", user.getName());
                map.put("instructorEmail", user.getEmail());
            });
            return map;
        }).toList();
    }

    public void verifyInstructor(String instructorId) {
        User user = userRepository.findById(instructorId)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Instructor user not found"));
        PendingRequest request = pendingRequestRepository.findByInstructorId(instructorId)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Application request not found"));

        user.setRole(Role.INSTRUCTOR);
        userRepository.save(user);

        request.setStatus(RequestStatus.APPROVED);
        pendingRequestRepository.save(request);
    }

    public void rejectInstructor(String instructorId, String reason) {
        User user = userRepository.findById(instructorId)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Instructor user not found"));
        PendingRequest request = pendingRequestRepository.findByInstructorId(instructorId)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Application request not found"));

        request.setStatus(RequestStatus.REJECTED);
        pendingRequestRepository.save(request);

        emailService.sendRejectionEmail(user.getEmail(), reason);
    }
}
