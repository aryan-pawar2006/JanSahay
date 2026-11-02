package com.jansahay.dto.scheme;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ApplicationGuideDto {
    private Long id;
    private Integer stepNumber;
    private String title;
    private String instruction;
    private String sourceUrl;
}
