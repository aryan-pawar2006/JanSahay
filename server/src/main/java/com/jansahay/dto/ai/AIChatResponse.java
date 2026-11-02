package com.jansahay.dto.ai;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AIChatResponse {
    private String answer;
    private boolean aiAvailable;
    private String provider;
    private String disclaimer;
    private java.util.List<String> sources;
    private String dataStatus;
    private String officialUrl;
    private String language;
}
