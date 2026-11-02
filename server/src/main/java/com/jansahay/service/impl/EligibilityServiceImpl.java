package com.jansahay.service.impl;

import com.jansahay.dto.recommendation.RecommendationResponse;
import com.jansahay.entity.*;
import com.jansahay.enums.*;
import com.jansahay.exception.ResourceNotFoundException;
import com.jansahay.repository.*;
import com.jansahay.service.EligibilityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class EligibilityServiceImpl implements EligibilityService {
    private final SchemeRepository schemeRepository;
    private final EligibilityRuleRepository eligibilityRuleRepository;
    private final UserProfileRepository userProfileRepository;
    private final EducationProfileRepository educationProfileRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final UserRepository userRepository;

    @Override
    public RecommendationResponse evaluateScheme(Long userId, Long schemeId) {
        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", schemeId));
        Map<String, String> profileMap = buildProfileMap(userId);
        List<EligibilityRule> rules = eligibilityRuleRepository.findBySchemeId(schemeId);
        return evaluate(scheme, rules, profileMap);
    }

    @Override
    public List<RecommendationResponse> evaluateAllSchemes(Long userId) {
        Map<String, String> profileMap = buildProfileMap(userId);
        List<Scheme> schemes = schemeRepository.findByActiveTrue();
        return schemes.stream()
                .map(scheme -> {
                    List<EligibilityRule> rules = eligibilityRuleRepository.findBySchemeId(scheme.getId());
                    return evaluate(scheme, rules, profileMap);
                })
                .filter(r -> r.getMatchType() != MatchType.NOT_A_MATCH)
                .sorted(Comparator.comparingDouble(RecommendationResponse::getMatchScore).reversed())
                .collect(Collectors.toList());
    }

    private RecommendationResponse evaluate(Scheme scheme, List<EligibilityRule> rules, Map<String, String> profileMap) {
        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        List<String> failed = new ArrayList<>();
        int evaluatable = 0;
        int matchedCount = 0;
        for (EligibilityRule rule : rules) {
            String profileValue = profileMap.get(rule.getField().toLowerCase());
            if (profileValue == null || profileValue.isBlank()) {
                missing.add(rule.getDescription() != null ? rule.getDescription() : "Required information: " + rule.getField());
            } else {
                evaluatable++;
                if (evaluateRule(profileValue, rule.getOperator(), rule.getValue())) {
                    matchedCount++;
                    matched.add(rule.getDescription() != null ? rule.getDescription() :
                            formatMatchExplanation(rule.getField(), rule.getValue()));
                } else {
                    if (Boolean.TRUE.equals(rule.getRequired())) {
                        failed.add(rule.getDescription() != null ? rule.getDescription() :
                                "Does not meet: " + rule.getField() + " " + rule.getOperator() + " " + rule.getValue());
                    }
                }
            }
        }
        double score = evaluatable == 0 ? 50.0 : (matchedCount * 100.0 / evaluatable);
        MatchType matchType = determineMatchType(score, failed, missing, rules.size());
        return RecommendationResponse.builder()
                .schemeId(scheme.getId()).schemeName(scheme.getName())
                .schemeCategory(scheme.getCategory() != null ? scheme.getCategory().name() : "")
                .governmentLevel(scheme.getGovernmentLevel() != null ? scheme.getGovernmentLevel().name() : "")
                .benefit(scheme.getBenefit()).matchScore(Math.round(score * 10.0) / 10.0)
                .matchType(matchType).matchedConditions(matched)
                .missingInformation(missing).failedConditions(failed)
                .sourceUrl(scheme.getSourceUrl())
                .lastVerified(scheme.getLastVerified() != null ? scheme.getLastVerified().toString() : "Not specified")
                .generatedAt(java.time.LocalDateTime.now())
                .build();
    }

    private boolean evaluateRule(String profileValue, RuleOperator operator, String ruleValue) {
        try {
            switch (operator) {
                case EQUALS -> { return profileValue.equalsIgnoreCase(ruleValue); }
                case NOT_EQUALS -> { return !profileValue.equalsIgnoreCase(ruleValue); }
                case CONTAINS -> { return profileValue.toLowerCase().contains(ruleValue.toLowerCase()); }
                case IN -> {
                    String[] values = ruleValue.split(",");
                    return Arrays.stream(values).anyMatch(v -> v.trim().equalsIgnoreCase(profileValue));
                }
                case GREATER_THAN -> {
                    return Double.parseDouble(profileValue) > Double.parseDouble(ruleValue);
                }
                case LESS_THAN -> {
                    return Double.parseDouble(profileValue) < Double.parseDouble(ruleValue);
                }
                case GREATER_THAN_OR_EQUAL -> {
                    return Double.parseDouble(profileValue) >= Double.parseDouble(ruleValue);
                }
                case LESS_THAN_OR_EQUAL -> {
                    return Double.parseDouble(profileValue) <= Double.parseDouble(ruleValue);
                }
                default -> { return false; }
            }
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private MatchType determineMatchType(double score, List<String> failed, List<String> missing, int totalRules) {
        if (!failed.isEmpty()) return MatchType.NOT_A_MATCH;
        if (!missing.isEmpty()) return MatchType.MORE_INFORMATION_REQUIRED;
        if (score >= 85) return MatchType.STRONG_MATCH;
        if (score >= 50) return MatchType.POTENTIAL_MATCH;
        return MatchType.MORE_INFORMATION_REQUIRED;
    }

    private Map<String, String> buildProfileMap(Long userId) {
        Map<String, String> map = new HashMap<>();
        userProfileRepository.findByUserId(userId).ifPresent(profile -> {
            if (profile.getCategory() != null) map.put("category", profile.getCategory().name());
            if (profile.getState() != null) map.put("state", profile.getState());
            if (profile.getDistrict() != null) map.put("district", profile.getDistrict());
            if (profile.getOccupation() != null) map.put("occupation", profile.getOccupation());
            if (profile.getIncomeRange() != null) map.put("incomerange", profile.getIncomeRange().name());
        });
        educationProfileRepository.findByUserId(userId).ifPresent(ep -> {
            if (ep.getEducationLevel() != null) map.put("educationlevel", ep.getEducationLevel().name());
            if (ep.getCourse() != null) map.put("course", ep.getCourse());
            if (ep.getCurrentYear() != null) map.put("currentyear", ep.getCurrentYear().toString());
        });
        farmerProfileRepository.findByUserId(userId).ifPresent(fp -> {
            if (fp.getFarmingType() != null) map.put("farmingtype", fp.getFarmingType().name());
            if (fp.getCropActivity() != null) map.put("cropactivity", fp.getCropActivity());
            if (fp.getLandArea() != null) map.put("landarea", fp.getLandArea().toString());
            if (fp.getLandOwnership() != null) map.put("landownership", fp.getLandOwnership().name());
        });
        businessProfileRepository.findByUserId(userId).ifPresent(bp -> {
            if (bp.getBusinessType() != null) map.put("businesstype", bp.getBusinessType());
            if (bp.getBusinessStage() != null) map.put("businessstage", bp.getBusinessStage().name());
            if (bp.getMsmeStatus() != null) map.put("msmestatus", bp.getMsmeStatus().name());
        });
        return map;
    }

    private String formatMatchExplanation(String field, String value) {
        return switch (field.toLowerCase()) {
            case "state" -> "Applicant is from " + value;
            case "category" -> "Applicant is a " + value.replace("_", " ").toLowerCase();
            case "incomerange" -> "Income range matches the scheme condition";
            case "educationlevel" -> "Education level matches: " + value.replace("_", " ").toLowerCase();
            case "farmingtype" -> "Farming type matches: " + value.replace("_", " ").toLowerCase();
            case "msmestatus" -> "MSME status matches: " + value.replace("_", " ").toLowerCase();
            default -> "Profile matches: " + field + " = " + value;
        };
    }
}
