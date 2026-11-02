package com.jansahay.dto.scheme;
import com.jansahay.enums.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SchemeCreateRequest {
    @NotBlank(message = "Scheme name is required")
    private String name;
    @NotBlank(message = "Description is required")
    private String description;
    @NotNull
    private GovernmentLevel governmentLevel;
    private String state;
    @NotNull
    private SchemeCategory category;
    @NotBlank
    private String benefit;
    private String sourceUrl;
    private LocalDate lastVerified;
    @Builder.Default
    private Boolean isDemoData = false;
}
