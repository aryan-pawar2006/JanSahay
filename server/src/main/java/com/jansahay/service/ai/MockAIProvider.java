package com.jansahay.service.ai;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "ai.provider", havingValue = "mock", matchIfMissing = true)
public class MockAIProvider implements AIProvider {
    @Override
    public String generateResponse(String systemPrompt, String userMessage) {
        String lowerQuestion = userMessage.toLowerCase();
        if (lowerQuestion.contains("what is") || lowerQuestion.contains("about this") || lowerQuestion.contains("explain")) {
            return "This government scheme is designed to provide support and benefits to eligible citizens. " +
                   "Based on the scheme information available, it offers financial assistance or services as described. " +
                   "Please review the eligibility conditions carefully and verify all details from the official government source. " +
                   "\n\n[Note: This is a demo response. Configure a Gemini API key for full AI assistance.]";
        } else if (lowerQuestion.contains("document") || lowerQuestion.contains("what do i need")) {
            return "To apply for this scheme, you will typically need identity proof (such as Aadhaar card), " +
                   "income certificate, domicile certificate, and any category-specific documents listed in the requirements section. " +
                   "Please check the 'Required Documents' section for the complete and verified list. " +
                   "\n\n[Note: This is a demo response. Configure a Gemini API key for full AI assistance.]";
        } else if (lowerQuestion.contains("how to apply") || lowerQuestion.contains("apply") || lowerQuestion.contains("steps")) {
            return "To apply for this scheme: \n1. Gather all required documents listed in the scheme details. " +
                   "\n2. Visit the official government portal (link provided in the scheme details). " +
                   "\n3. Complete the online or offline application form. " +
                   "\n4. Submit your application with supporting documents. " +
                   "\n5. Keep the acknowledgment receipt for tracking. " +
                   "\n\nFor exact steps, please follow the Application Roadmap section. " +
                   "\n\n[Note: This is a demo response. Configure a Gemini API key for full AI assistance.]";
        } else if (lowerQuestion.contains("eligible") || lowerQuestion.contains("qualify")) {
            return "Eligibility for this scheme is determined by our rule engine based on your profile information. " +
                   "Please refer to the 'Why This Scheme Appeared' section to understand the matching conditions. " +
                   "Remember that the final eligibility determination must be made by the concerned government authority. " +
                   "\n\n[Note: This is a demo response. Configure a Gemini API key for full AI assistance.]";
        } else {
            return "Thank you for your question about this government scheme. " +
                   "Based on the available scheme information, I can help you understand the key aspects of this scheme. " +
                   "For specific queries, please check the official government source listed in the scheme details or contact the concerned government office directly. " +
                   "\n\n[Note: This is a demo response. Configure a Gemini API key for full AI assistance.]";
        }
    }

    @Override
    public boolean isAvailable() { return true; }

    @Override
    public String getProviderName() { return "Mock AI (Demo Mode)"; }
}
