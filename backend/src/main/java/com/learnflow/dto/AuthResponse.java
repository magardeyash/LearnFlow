package com.learnflow.dto;

import com.learnflow.model.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserResponse user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private String id;
        private String name;
        private String email;
        private Role role;
        @JsonProperty("isVerified")
        private boolean isVerified;
        private String avatar;
        @Builder.Default
        private java.util.List<String> enrolledCourses = new java.util.ArrayList<>();
    }
}
