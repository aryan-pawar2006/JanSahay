package com.jansahay.service.impl;

import com.jansahay.dto.recommendation.RecommendationResponse;
import com.jansahay.entity.*;
import com.jansahay.enums.MatchType;
import com.jansahay.repository.*;
import com.jansahay.service.EligibilityService;
import com.jansahay.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {
    private final EligibilityService eligibilityService;
    private final RecommendationRepository recommendationRepository;
    private final MatchResultRepository matchResultRepository;
    private final SchemeRepository schemeRepository;

    @Override
    @Transactional
    public List<RecommendationResponse> generateRecommendations(Long userId) {
        log.info("Generating recommendations for user: {}", userId);
        recommendationRepository.deleteByUserId(userId);
        List<RecommendationResponse> results = eligibilityService.evaluateAllSchemes(userId);
        for (RecommendationResponse result : results) {
            Recommendation rec = Recommendation.builder()
                    .userId(userId).schemeId(result.getSchemeId())
                    .matchScore(result.getMatchScore()).matchType(result.getMatchType())
                    .build();
            rec = recommendationRepository.save(rec);
            result.setRecommendationId(rec.getId());
            List<MatchResult> matchResults = new ArrayList<>();
            for (String m : result.getMatchedConditions()) {
                matchResults.add(MatchResult.builder().recommendation(rec).matched(true).explanation(m).build());
            }
            for (String m : result.getMissingInformation()) {
                matchResults.add(MatchResult.builder().recommendation(rec).matched(false).explanation("MISSING: " + m).build());
            }
            matchResultRepository.saveAll(matchResults);
        }
        return rankRecommendations(results);
    }

    @Override
    public List<RecommendationResponse> getUserRecommendations(Long userId) {
        List<Recommendation> recs = recommendationRepository.findByUserIdOrderByMatchScoreDesc(userId);
        if (recs.isEmpty()) {
            return generateRecommendations(userId);
        }
        return recs.stream().map(rec -> {
            List<MatchResult> mrs = matchResultRepository.findByRecommendationId(rec.getId());
            List<String> matched = mrs.stream().filter(m -> Boolean.TRUE.equals(m.getMatched())).map(MatchResult::getExplanation).collect(Collectors.toList());
            List<String> missing = mrs.stream().filter(m -> !Boolean.TRUE.equals(m.getMatched()) && m.getExplanation().startsWith("MISSING:")).map(m -> m.getExplanation().substring(8)).collect(Collectors.toList());
            schemeRepository.findById(rec.getSchemeId()).ifPresent(scheme -> {});
            return schemeRepository.findById(rec.getSchemeId()).map(scheme ->
                RecommendationResponse.builder()
                    .recommendationId(rec.getId()).schemeId(rec.getSchemeId())
                    .schemeName(scheme.getName())
                    .schemeCategory(scheme.getCategory() != null ? scheme.getCategory().name() : "")
                    .governmentLevel(scheme.getGovernmentLevel() != null ? scheme.getGovernmentLevel().name() : "")
                    .benefit(scheme.getBenefit()).matchScore(rec.getMatchScore())
                    .matchType(rec.getMatchType()).matchedConditions(matched)
                    .missingInformation(missing).failedConditions(new ArrayList<>())
                    .sourceUrl(scheme.getSourceUrl())
                    .lastVerified(scheme.getLastVerified() != null ? scheme.getLastVerified().toString() : "Not specified")
                    .generatedAt(rec.getGeneratedAt())
                    .build()
            ).orElse(null);
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    @Override
    public List<RecommendationResponse> rankRecommendations(List<RecommendationResponse> recommendations) {
        return recommendations.stream()
                .sorted(Comparator.comparingInt((RecommendationResponse r) ->
                        matchTypeRank(r.getMatchType())).thenComparingDouble(
                        r -> -r.getMatchScore()))
                .collect(Collectors.toList());
    }

    private int matchTypeRank(MatchType type) {
        return switch (type) {
            case STRONG_MATCH -> 0;
            case POTENTIAL_MATCH -> 1;
            case MORE_INFORMATION_REQUIRED -> 2;
            case NOT_A_MATCH -> 3;
        };
    }
}
