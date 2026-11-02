package com.jansahay.dto.ai;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor
public class AIChatRequest {
    @NotBlank(message = "Question is required")
    private String question;
    private Long schemeId;
    private String context;
    private String language;
}
