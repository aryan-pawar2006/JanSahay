package com.jansahay.dto.scheme;
import com.jansahay.enums.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SchemeDto {
    private Long id;
    private String name;
    private String description;
    private GovernmentLevel governmentLevel;
    private String state;
    private SchemeCategory category;
    private String benefit;
    private String sourceUrl;
    private LocalDate lastVerified;
    private Boolean active;
    private Boolean isDemoData;
    private List<EligibilityRuleDto> eligibilityRules;
    private List<RequiredDocumentDto> requiredDocuments;
    private List<ApplicationGuideDto> applicationGuides;
    private LocalDateTime createdAt;
}
