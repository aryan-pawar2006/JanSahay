package com.jansahay.service;
import com.jansahay.dto.recommendation.RecommendationResponse;
import java.util.List;
public interface RecommendationService {
    List<RecommendationResponse> generateRecommendations(Long userId);
    List<RecommendationResponse> getUserRecommendations(Long userId);
    List<RecommendationResponse> rankRecommendations(List<RecommendationResponse> recommendations);
}
