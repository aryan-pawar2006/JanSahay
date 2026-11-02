package com.jansahay.dto.update;
import lombok.*;
import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class GovernmentUpdateDto {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String source;
    private String sourceUrl;
    private LocalDate publishedDate;
    private String relevanceTags;
    private String dataStatus;
    private Boolean active;
}
