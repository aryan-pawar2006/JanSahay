package com.jansahay.service.impl;

import com.jansahay.dto.ai.*;
import com.jansahay.service.AIService;
import com.jansahay.service.ai.AIProvider;
import com.jansahay.service.ai.KnowledgeRetrievalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AIServiceImpl implements AIService {
    private final AIProvider aiProvider;
    private final KnowledgeRetrievalService knowledgeRetrievalService;

    private static final String SYSTEM_PROMPT = """  
            You are JanSahay AI, a government-information assistant for Indian citizens.
            You must answer ONLY using the verified scheme information supplied in the context below.
            Do NOT invent eligibility conditions, benefits, documents, deadlines or URLs.
            Do NOT guarantee that a user is eligible for any scheme.
            The eligibility result is determined by the application's rule engine, not by you.
            Your role is to explain the information in simple, clear language.
            If information is missing or unavailable, clearly say so and direct the user to the official source.
            Always encourage users to verify final eligibility with the concerned government authority.
            Keep responses concise, helpful, and friendly.
            """;

    @Override
    public AIChatResponse answerQuestion(Long userId, AIChatRequest request) {
        String context = knowledgeRetrievalService.buildComprehensiveContextString(userId, request.getSchemeId(), request.getQuestion());
        String fullSystemPrompt = SYSTEM_PROMPT + (context.isBlank() ? "" : "\n\n" + context);
        String answer;
        try {
            answer = aiProvider.generateResponse(fullSystemPrompt, request.getQuestion());
        } catch (Exception e) {
            log.error("AI service error: {}", e.getMessage());
            answer = "AI assistance is temporarily unavailable. Please refer to the official scheme source for accurate information.";
        }

        java.util.List<String> sources = new java.util.ArrayList<>();
        sources.add("JanSahay Verified Database");
        if (request.getSchemeId() != null) {
            sources.add("Official Government Scheme Registry");
        }

        return AIChatResponse.builder()
                .answer(answer)
                .aiAvailable(aiProvider.isAvailable())
                .provider(aiProvider.getProviderName())
                .sources(sources)
                .dataStatus("LIVE")
                .language(request.getLanguage() != null ? request.getLanguage() : "en")
                .disclaimer("JanSahay AI provides informational guidance only. Please verify eligibility and application details with the official government authority.")
                .build();
    }

    @Override
    public AIChatResponse explainScheme(Long userId, Long schemeId) {
        String context = knowledgeRetrievalService.buildSchemeContextString(schemeId);
        String question = "Please explain this scheme in simple language that any citizen can understand.";
        String fullSystemPrompt = SYSTEM_PROMPT + "\n\n" + context;
        String answer;
        try {
            answer = aiProvider.generateResponse(fullSystemPrompt, question);
        } catch (Exception e) {
            log.error("AI explain scheme error: {}", e.getMessage());
            answer = "AI assistance is temporarily unavailable. Please refer to the official scheme source for accurate information.";
        }
        return AIChatResponse.builder()
                .answer(answer).aiAvailable(aiProvider.isAvailable())
                .provider(aiProvider.getProviderName())
                .disclaimer("JanSahay AI provides informational guidance only. Please verify eligibility and application details with the official government authority.")
                .build();
    }
}
