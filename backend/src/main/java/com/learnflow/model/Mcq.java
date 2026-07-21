package com.learnflow.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mcq {
    private String question;
    
    @Builder.Default
    private List<String> options = new ArrayList<>();
    
    private int correctIndex;
}
