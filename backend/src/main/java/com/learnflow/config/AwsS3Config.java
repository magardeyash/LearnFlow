package com.learnflow.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AnonymousCredentialsProvider;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

// NOTE: AWS S3 is intentionally disabled due to cost. Re-enable by uncommenting credentials below.
@Configuration
public class AwsS3Config {

//    @Value("${aws.access-key}")
//    private String accessKey;
//
//    @Value("${aws.secret-key}")
//    private String secretKey;
//
//    @Value("${aws.s3.region}")
//    private String region;

    @Bean
    public S3Client s3Client() {
        // DISABLED: return S3Client.builder()
        //         .region(Region.of(region))
        //         .credentialsProvider(StaticCredentialsProvider.create(
        //                 AwsBasicCredentials.create(accessKey, secretKey)
        //         ))
        //         .build();
        return S3Client.builder()
                .region(Region.AP_SOUTH_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build();
    }

    @Bean
    public S3Presigner s3Presigner() {
        // DISABLED: return S3Presigner.builder()
        //         .region(Region.of(region))
        //         .credentialsProvider(StaticCredentialsProvider.create(
        //                 AwsBasicCredentials.create(accessKey, secretKey)
        //         ))
        //         .build();
        return S3Presigner.builder()
                .region(Region.AP_SOUTH_1)
                .credentialsProvider(AnonymousCredentialsProvider.create())
                .build();
    }
}
