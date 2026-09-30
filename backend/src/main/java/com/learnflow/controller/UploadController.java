package com.learnflow.controller;

import com.learnflow.dto.PresignedUrlRequest;
import com.learnflow.service.S3Service;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// NOTE: AWS S3 upload is intentionally disabled due to cost.
// Re-enable by uncommenting S3Service injection and the original endpoint logic below.
@RestController
@RequestMapping("/api/upload")
public class UploadController {

//    private final S3Service s3Service;
//
//    public UploadController(S3Service s3Service) {
//        this.s3Service = s3Service;
//    }

    @PostMapping("/presigned-url")
    public ResponseEntity<Map<String, String>> getPresignedUrl(/*@Valid @RequestBody PresignedUrlRequest request*/) {
        // DISABLED:
        // Map<String, String> urls = s3Service.generatePresignedUploadUrl(
        //         request.getFileName(),
        //         request.getContentType(),
        //         request.getFolder()
        // );
        // return ResponseEntity.ok(urls);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("error", "File upload feature is currently disabled."));
    }
}
