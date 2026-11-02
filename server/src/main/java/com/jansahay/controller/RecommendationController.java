package com.jansahay.controller;

import com.jansahay.dto.ApiResponse;
import com.jansahay.dto.recommendation.RecommendationResponse;
import com.jansahay.service.RecommendationService;
import com.jansahay.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {
    private final RecommendationService recommendationService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>> getRecommendations() {
        Long userId = securityUtils.getCurrentUserId();
        List<RecommendationResponse> recommendations = recommendationService.getUserRecommendations(userId);
        return ResponseEntity.ok(ApiResponse.success("Recommendations retrieved", recommendations));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>> generateRecommendations() {
        Long userId = securityUtils.getCurrentUserId();
        List<RecommendationResponse> recommendations = recommendationService.generateRecommendations(userId);
        return ResponseEntity.ok(ApiResponse.success("Recommendations generated successfully", recommendations));
    }
}
