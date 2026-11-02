package com.jansahay.service.ai;

import com.jansahay.entity.*;
import com.jansahay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DatabaseKnowledgeRetrievalService implements KnowledgeRetrievalService {
    private final SchemeRepository schemeRepository;
    private final EligibilityRuleRepository eligibilityRuleRepository;
    private final RequiredDocumentRepository requiredDocumentRepository;
    private final ApplicationGuideRepository applicationGuideRepository;

    @Override
    public Map<String, Object> retrieveSchemeContext(Long schemeId) {
        Map<String, Object> context = new LinkedHashMap<>();
        schemeRepository.findById(schemeId).ifPresent(scheme -> {
            context.put("name", scheme.getName());
            context.put("description", scheme.getDescription());
            context.put("benefit", scheme.getBenefit());
            context.put("category", scheme.getCategory());
            context.put("governmentLevel", scheme.getGovernmentLevel());
            context.put("state", scheme.getState());
            context.put("sourceUrl", scheme.getSourceUrl());
            context.put("lastVerified", scheme.getLastVerified());
        });
        List<EligibilityRule> rules = eligibilityRuleRepository.findBySchemeId(schemeId);
        context.put("eligibilityRules", rules.stream().map(EligibilityRule::getDescription).collect(Collectors.toList()));
        List<RequiredDocument> docs = requiredDocumentRepository.findBySchemeId(schemeId);
        context.put("requiredDocuments", docs.stream().map(d -> d.getDocumentName() + (d.getPurpose() != null ? ": " + d.getPurpose() : "")).collect(Collectors.toList()));
        List<ApplicationGuide> guides = applicationGuideRepository.findBySchemeIdOrderByStepNumberAsc(schemeId);
        context.put("applicationSteps", guides.stream().map(g -> g.getStepNumber() + ". " + g.getTitle() + ": " + g.getInstruction()).collect(Collectors.toList()));
        return context;
    }

    @Override
    public String buildSchemeContextString(Long schemeId) {
        Map<String, Object> ctx = retrieveSchemeContext(schemeId);
        StringBuilder sb = new StringBuilder();
        sb.append("SCHEME INFORMATION (Verified from database):\n");
        ctx.forEach((k, v) -> sb.append(k).append(": ").append(v).append("\n"));
        return sb.toString();
    }
}
