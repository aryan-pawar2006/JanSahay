package com.jansahay.service.ai;
import java.util.Map;
public interface KnowledgeRetrievalService {
    Map<String, Object> retrieveSchemeContext(Long schemeId);
    String buildSchemeContextString(Long schemeId);
    Map<String, Object> retrieveUserDocumentContext(Long userId);
    String buildComprehensiveContextString(Long userId, Long schemeId, String query);
}
