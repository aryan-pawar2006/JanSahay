package com.jansahay.service;
import com.jansahay.dto.ai.AIChatRequest;
import com.jansahay.dto.ai.AIChatResponse;
public interface AIService {
    AIChatResponse answerQuestion(Long userId, AIChatRequest request);
    AIChatResponse explainScheme(Long userId, Long schemeId);
}
