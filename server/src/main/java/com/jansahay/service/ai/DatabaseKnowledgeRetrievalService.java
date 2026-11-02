package com.jansahay.service.ai;

import com.jansahay.entity.*;
import com.jansahay.enums.DocumentStatus;
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
    private final UserProfileRepository userProfileRepository;
    private final UserDocumentRepository userDocumentRepository;
    private final UserRepository userRepository;

    @Override
    public Map<String, Object> retrieveSchemeContext(Long schemeId) {
        Map<String, Object> context = new LinkedHashMap<>();
        schemeRepository.findById(schemeId).ifPresent(scheme -> {
            context.put("id", scheme.getId());
            context.put("name", scheme.getName());
            context.put("description", scheme.getDescription());
            context.put("benefit", scheme.getBenefit());
            context.put("category", scheme.getCategory());
            context.put("governmentLevel", scheme.getGovernmentLevel());
            context.put("state", scheme.getState());
            context.put("sourceUrl", scheme.getSourceUrl());
            context.put("lastVerified", scheme.getLastVerified());
            context.put("dataStatus", scheme.getDataStatus());
        });
        List<EligibilityRule> rules = eligibilityRuleRepository.findBySchemeId(schemeId);
        context.put("eligibilityRules", rules.stream().map(EligibilityRule::getDescription).collect(Collectors.toList()));
        List<RequiredDocument> docs = requiredDocumentRepository.findBySchemeId(schemeId);
        context.put("requiredDocuments", docs.stream().map(d -> d.getDocumentName() + (d.getPurpose() != null ? " (" + d.getPurpose() + ")" : "")).collect(Collectors.toList()));
        List<ApplicationGuide> guides = applicationGuideRepository.findBySchemeIdOrderByStepNumberAsc(schemeId);
        context.put("applicationSteps", guides.stream().map(g -> g.getStepNumber() + ". " + g.getTitle() + ": " + g.getInstruction()).collect(Collectors.toList()));
        return context;
    }

    @Override
    public String buildSchemeContextString(Long schemeId) {
        Map<String, Object> ctx = retrieveSchemeContext(schemeId);
        StringBuilder sb = new StringBuilder();
        sb.append("SCHEME INFORMATION (Verified from official database):\n");
        ctx.forEach((k, v) -> sb.append(k).append(": ").append(v).append("\n"));
        return sb.toString();
    }

    @Override
    public Map<String, Object> retrieveUserDocumentContext(Long userId) {
        Map<String, Object> context = new LinkedHashMap<>();
        if (userId == null) {
            context.put("userStatus", "GUEST_UNREGISTERED");
            context.put("inHandDocuments", Collections.emptyList());
            return context;
        }

        userRepository.findById(userId).ifPresent(u -> context.put("userName", u.getName()));

        userProfileRepository.findByUserId(userId).ifPresent(p -> {
            context.put("category", p.getCategory() != null ? p.getCategory().name() : "GENERAL");
            context.put("state", p.getState());
            context.put("district", p.getDistrict());
            context.put("incomeRange", p.getIncomeRange() != null ? p.getIncomeRange().name() : "NOT_SPECIFIED");

            List<String> inHand = new ArrayList<>();
            if (p.getInHandDocuments() != null && !p.getInHandDocuments().isBlank()) {
                inHand.addAll(Arrays.stream(p.getInHandDocuments().split("\\|\\|\\|"))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList()));
            }

            // Also merge any documents marked AVAILABLE in user_documents
            List<UserDocument> userDocs = userDocumentRepository.findByUserId(userId);
            for (UserDocument ud : userDocs) {
                if (ud.getStatus() == DocumentStatus.AVAILABLE && !inHand.contains(ud.getDocumentName())) {
                    inHand.add(ud.getDocumentName());
                }
            }
            context.put("inHandDocuments", inHand);
            context.put("inHandCount", inHand.size());
        });

        return context;
    }

    @Override
    public String buildComprehensiveContextString(Long userId, Long schemeId, String query) {
        StringBuilder sb = new StringBuilder();

        // 1. User In-Hand Documentation & Profile Context
        Map<String, Object> userCtx = retrieveUserDocumentContext(userId);
        sb.append("CITIZEN PROFILE & IN-HAND DOCUMENTATION (from verified profile):\n");
        sb.append("User Status: ").append(userCtx.getOrDefault("userStatus", "REGISTERED_CITIZEN")).append("\n");
        if (userCtx.containsKey("userName")) sb.append("Name: ").append(userCtx.get("userName")).append("\n");
        if (userCtx.containsKey("category")) sb.append("Category: ").append(userCtx.get("category")).append("\n");
        if (userCtx.containsKey("state")) sb.append("State: ").append(userCtx.get("state")).append("\n");
        if (userCtx.containsKey("district")) sb.append("District: ").append(userCtx.get("district")).append("\n");
        if (userCtx.containsKey("incomeRange")) sb.append("Income Range: ").append(userCtx.get("incomeRange")).append("\n");

        @SuppressWarnings("unchecked")
        List<String> inHandDocs = (List<String>) userCtx.getOrDefault("inHandDocuments", Collections.emptyList());
        sb.append("Documents Currently in Hand (").append(inHandDocs.size()).append(" ready): ");
        if (inHandDocs.isEmpty()) {
            sb.append("None declared yet.\n");
        } else {
            sb.append(String.join(", ", inHandDocs)).append("\n");
        }
        sb.append("\n");

        // 2. Identify Scheme Context
        Long targetSchemeId = schemeId;
        if (targetSchemeId == null && query != null) {
            targetSchemeId = findBestMatchingSchemeId(query);
        }

        if (targetSchemeId != null) {
            Map<String, Object> schemeCtx = retrieveSchemeContext(targetSchemeId);
            sb.append("TARGET SCHEME CONTEXT:\n");
            schemeCtx.forEach((k, v) -> sb.append(k).append(": ").append(v).append("\n"));

            // Calculate Document Comparison
            List<RequiredDocument> reqDocs = requiredDocumentRepository.findBySchemeId(targetSchemeId);
            List<String> readyDocs = new ArrayList<>();
            List<String> missingDocs = new ArrayList<>();

            for (RequiredDocument rd : reqDocs) {
                boolean hasDoc = inHandDocs.stream().anyMatch(inHand ->
                        inHand.equalsIgnoreCase(rd.getDocumentName()) ||
                        rd.getDocumentName().toLowerCase().contains(inHand.toLowerCase()) ||
                        inHand.toLowerCase().contains(rd.getDocumentName().toLowerCase())
                );
                if (hasDoc) {
                    readyDocs.add(rd.getDocumentName());
                } else {
                    missingDocs.add(rd.getDocumentName() + (rd.getPurpose() != null ? " (" + rd.getPurpose() + ")" : ""));
                }
            }

            sb.append("\nDOCUMENT READINESS COMPARISON FOR THIS SCHEME:\n");
            sb.append("- In-Hand Ready Documents (").append(readyDocs.size()).append("/").append(reqDocs.size()).append("): ")
              .append(readyDocs.isEmpty() ? "None matching yet" : String.join(", ", readyDocs)).append("\n");
            sb.append("- Still Missing / Needed Documents (").append(missingDocs.size()).append("): ")
              .append(missingDocs.isEmpty() ? "All required documents are ready in hand!" : String.join("; ", missingDocs)).append("\n");
        } else {
            // General query - list summary of active schemes
            List<Scheme> allSchemes = schemeRepository.findByActiveTrue();
            sb.append("ACTIVE SCHEMES DIRECTORY (").append(allSchemes.size()).append(" schemes available in database):\n");
            allSchemes.stream().limit(15).forEach(s ->
                    sb.append("• ").append(s.getName()).append(" [").append(s.getCategory()).append("]: ").append(s.getBenefit()).append("\n")
            );
        }

        return sb.toString();
    }

    private Long findBestMatchingSchemeId(String query) {
        String lower = query.toLowerCase();
        List<Scheme> schemes = schemeRepository.findByActiveTrue();
        for (Scheme s : schemes) {
            String nameLower = s.getName().toLowerCase();
            if (lower.contains(nameLower)) return s.getId();
            // Check acronyms / short tokens
            if ((lower.contains("kisan") || lower.contains("pm-kisan") || lower.contains("pmkisan")) && nameLower.contains("kisan")) return s.getId();
            if (lower.contains("mudra") && nameLower.contains("mudra")) return s.getId();
            if ((lower.contains("ebc") || lower.contains("rajarshi") || lower.contains("shahu")) && (nameLower.contains("ebc") || nameLower.contains("rajarshi"))) return s.getId();
            if ((lower.contains("ladki") || lower.contains("bahin")) && nameLower.contains("ladki")) return s.getId();
            if ((lower.contains("pragati") || lower.contains("girl")) && nameLower.contains("pragati")) return s.getId();
            if (lower.contains("vishwakarma") && nameLower.contains("vishwakarma")) return s.getId();
            if ((lower.contains("ayushman") || lower.contains("pm-jay") || lower.contains("pmjay")) && (nameLower.contains("ayushman") || nameLower.contains("pm-jay"))) return s.getId();
            if (lower.contains("svanidhi") && nameLower.contains("svanidhi")) return s.getId();
            if (lower.contains("sukanya") && nameLower.contains("sukanya")) return s.getId();
            if (lower.contains("awas") && (nameLower.contains("awas") || nameLower.contains("gharkul"))) return s.getId();
            if (lower.contains("cmegp") && nameLower.contains("cmegp")) return s.getId();
            if (lower.contains("namo") && nameLower.contains("namo")) return s.getId();
        }
        return null;
    }
}
