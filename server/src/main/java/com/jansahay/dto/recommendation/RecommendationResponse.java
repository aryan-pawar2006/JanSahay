package com.jansahay.dto.recommendation;
import com.jansahay.enums.MatchType;
import com.jansahay.dto.scheme.SchemeDto;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RecommendationResponse {
    private Long recommendationId;
    private Long schemeId;
    private String schemeName;
    private String schemeCategory;
    private String governmentLevel;
    private String benefit;
    private Double matchScore;
    private MatchType matchType;
    private List<String> matchedConditions;
    private List<String> missingInformation;
    private List<String> failedConditions;
    private String sourceUrl;
    private String lastVerified;
    private LocalDateTime generatedAt;
}
