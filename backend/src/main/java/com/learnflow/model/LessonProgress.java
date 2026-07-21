package com.learnflow.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgress {
    private String lessonId;
    
    @Builder.Default
    private boolean videoWatched = false;
    
    @Builder.Default
    private int quizScore = -1; // -1 indicates quiz not taken yet
    
    @Builder.Default
    private boolean notesDownloaded = false;
}
