package com.jansahay.service.ai;
public interface AIProvider {
    String generateResponse(String systemPrompt, String userMessage);
    boolean isAvailable();
    String getProviderName();
}
