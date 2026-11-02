package com.jansahay.service.ai;
import java.util.Map;
public interface KnowledgeRetrievalService {
    Map<String, Object> retrieveSchemeContext(Long schemeId);
    String buildSchemeContextString(Long schemeId);
}
