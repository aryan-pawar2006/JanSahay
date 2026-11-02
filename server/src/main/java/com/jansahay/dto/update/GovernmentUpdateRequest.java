package com.jansahay.dto.update;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;
@Data @NoArgsConstructor @AllArgsConstructor
public class GovernmentUpdateRequest {
    @NotBlank private String title;
    @NotBlank private String description;
    private String category;
    private String source;
    private String sourceUrl;
    private LocalDate publishedDate;
    private String relevanceTags;
    private Boolean active = true;
}
