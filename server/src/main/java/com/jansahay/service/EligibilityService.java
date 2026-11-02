package com.jansahay.service;
import com.jansahay.dto.recommendation.RecommendationResponse;
import java.util.List;
public interface EligibilityService {
    RecommendationResponse evaluateScheme(Long userId, Long schemeId);
    List<RecommendationResponse> evaluateAllSchemes(Long userId);
}
