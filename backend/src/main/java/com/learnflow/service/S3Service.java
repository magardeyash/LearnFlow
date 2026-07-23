package com.learnflow.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Presigner s3Presigner;
    private final String bucketName;
    private final String region;

    public S3Service(
            S3Presigner s3Presigner,
            @Value("${aws.s3.bucket}") String bucketName,
            @Value("${aws.s3.region}") String region) {
        this.s3Presigner = s3Presigner;
        this.bucketName = bucketName;
        this.region = region;
    }

    public Map<String, String> generatePresignedUploadUrl(String fileName, String contentType, String folder) {
        String prefix = (folder == null || folder.trim().isEmpty()) ? "" : folder.trim() + "/";
        
        String extension = "";
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = fileName.substring(dotIndex);
        }
        String uniqueFileName = prefix + UUID.randomUUID() + extension;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(uniqueFileName)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .putObjectRequest(putObjectRequest)
                .build();

        PresignedPutObjectRequest presignedPutObjectRequest = s3Presigner.presignPutObject(presignRequest);
        String presignedUrl = presignedPutObjectRequest.url().toString();

        String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, uniqueFileName);

        Map<String, String> response = new HashMap<>();
        response.put("presignedUrl", presignedUrl);
        response.put("fileUrl", fileUrl);
        
        return response;
    }
}
