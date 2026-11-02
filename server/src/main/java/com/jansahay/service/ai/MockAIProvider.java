package com.jansahay.service.ai;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@ConditionalOnProperty(name = "ai.provider", havingValue = "mock", matchIfMissing = true)
public class MockAIProvider implements AIProvider {

    @Override
    public String generateResponse(String systemPrompt, String userMessage) {
        String msg = userMessage.toLowerCase().trim();
        boolean isMarathi = isMarathiLanguage(userMessage);
        boolean isHindi = !isMarathi && isHindiLanguage(userMessage);

        // Extract context components
        String inHandDocs = extractSection(systemPrompt, "Documents Currently in Hand", "\n\n");
        String schemeName = extractLine(systemPrompt, "name:");
        String schemeDesc = extractLine(systemPrompt, "description:");
        String schemeBenefit = extractLine(systemPrompt, "benefit:");
        String schemeSource = extractLine(systemPrompt, "sourceUrl:");
        String readyDocs = extractLine(systemPrompt, "- In-Hand Ready Documents");
        String missingDocs = extractLine(systemPrompt, "- Still Missing / Needed Documents");
        String eligibilityRules = extractSection(systemPrompt, "eligibilityRules:", "requiredDocuments:");
        String applicationSteps = extractSection(systemPrompt, "applicationSteps:", "\n\n");

        // 1. In-Hand Documents Questions
        if (msg.contains("in hand") || msg.contains("have right now") || msg.contains("my document") ||
            msg.contains("what documents do i have") || msg.contains("which documents") && msg.contains("i have") ||
            msg.contains("कागदपत्रे आहेत") || msg.contains("माझ्याकडे") || msg.contains("दस्तावेज हैं") || msg.contains("मेरे पास")) {

            if (inHandDocs != null && !inHandDocs.isBlank() && !inHandDocs.contains("None declared")) {
                if (isMarathi) {
                    return "📋 **तुमच्याकडे सध्या खालील कागदपत्रे उपलब्ध आहेत:**\n\n" +
                           formatBulletList(inHandDocs) + "\n\n" +
                           "💡 **मार्गदर्शन:** योजनांसाठी अर्ज करताना ही कागदपत्रे थेट वापरली जातील. कोणत्याही विशिष्ट योजनेसाठी उर्वरित कागदपत्रे तपासण्यासाठी विचारा, उदा. *'EBC शिष्यवृत्तीसाठी मला अजून काय हवे?'*";
                } else if (isHindi) {
                    return "📋 **आपके पास वर्तमान में निम्नलिखित दस्तावेज उपलब्ध हैं:**\n\n" +
                           formatBulletList(inHandDocs) + "\n\n" +
                           "💡 **सुझाव:** जब आप किसी योजना के लिए आवेदन करेंगे, तो इन दस्तावेजों का सीधे उपयोग किया जाएगा। किसी विशिष्ट योजना के लिए आवश्यक बाकी दस्तावेजों के बारे में पूछें।";
                } else {
                    return "📋 **You currently hold the following documents in hand:**\n\n" +
                           formatBulletList(inHandDocs) + "\n\n" +
                           "💡 **Readiness Status:** These declared documents are marked as **AVAILABLE** in your profile and document checklist. You can ask me about any scheme (e.g. *'What do I still need for EBC Scholarship?'*) to see your exact remaining requirements.";
                }
            } else {
                if (isMarathi) {
                    return "⚠️ **तुमच्या प्रोफाइलमध्ये अद्याप कोणतीही कागदपत्रे जोडलेली नाहीत.**\n\nकृपया **प्रोफाइल विझार्ड (Step 4: Documents In Hand)** मध्ये जाऊन तुमच्याकडे असलेली कागदपत्रे निवडा, जसे की आधार कार्ड, उत्पन्नाचा दाखला, किंवा 7/12 उतारा.";
                } else {
                    return "⚠️ **No in-hand documents declared yet.**\n\nPlease visit your **Citizen Profile Wizard (Step 4: Documents in Hand)** to select the certificates you currently hold (such as Aadhaar Card, Income Certificate, Domicile, or 7/12 Extract). This enables JanSahay to calculate your instant application readiness!";
                }
            }
        }

        // 2. Scheme-Specific Document Comparison Questions
        if (msg.contains("document") || msg.contains("paperwork") || msg.contains("certificate") ||
            msg.contains("कागदपत्र") || msg.contains("दस्तावेज") || msg.contains("काय कागदपत्रे")) {

            StringBuilder sb = new StringBuilder();
            if (schemeName != null) {
                if (isMarathi) {
                    sb.append("📑 **").append(schemeName).append(" साठी आवश्यक कागदपत्रे:**\n\n");
                    if (readyDocs != null) sb.append("✅ **तुमच्याकडे तयार असलेली कागदपत्रे:**\n").append(readyDocs).append("\n\n");
                    if (missingDocs != null) sb.append("⏳ **अजून आवश्यक असलेली कागदपत्रे:**\n").append(missingDocs).append("\n\n");
                    sb.append("📌 अर्ज करण्यापूर्वी उर्वरित कागदपत्रे तयार ठेवा.");
                } else {
                    sb.append("📑 **Document Readiness Checklist for ").append(schemeName).append(":**\n\n");
                    if (readyDocs != null) sb.append("✅ **Ready in Your Hand:**\n").append(readyDocs.replace("- In-Hand Ready Documents", "• In Hand")).append("\n\n");
                    if (missingDocs != null) sb.append("⏳ **Still Needed / Missing:**\n").append(missingDocs.replace("- Still Missing / Needed Documents", "• Attention Needed")).append("\n\n");
                    sb.append("💡 **Action Guide:** You can view step-by-step acquisition instructions for any missing document in our **Document Preparation Guide** section.");
                }
                return sb.toString();
            } else {
                return "Commonly required documents for most government welfare schemes include:\n" +
                       "• **Identity & Address Proof:** Aadhaar Card, Voter ID, Ration Card\n" +
                       "• **Income & Domicile:** Tahsildar Income Certificate, State Domicile Certificate\n" +
                       "• **Financial:** Aadhaar-seeded Bank Passbook / Cancelled Cheque\n" +
                       "• **Category Specific:** 7/12 Satbara (Farmers), Bonafide & CAP Allotment (Students), Udyam MSME (Business)\n\n" +
                       "Mention a specific scheme name (e.g. *'Documents for PM-KISAN'* or *'Documents for Mudra Loan'*) for a personalized readiness check!";
            }
        }

        // 3. Eligibility Questions
        if (msg.contains("eligible") || msg.contains("qualify") || msg.contains("criteria") ||
            msg.contains("पात्र") || msg.contains("पात्रता") || msg.contains("योग्यता")) {

            if (schemeName != null) {
                if (isMarathi) {
                    return "🎯 **" + schemeName + " साठी पात्रता निकष:**\n\n" +
                           (eligibilityRules != null ? eligibilityRules.trim() : "सविस्तर माहिती उपलब्ध नाही.") + "\n\n" +
                           (schemeBenefit != null ? "🎁 **योजनेचा फायदा:** " + schemeBenefit + "\n\n" : "") +
                           "📌 अंतिम पात्रता संबंधित शासकीय विभागामार्फत कागदपत्रांच्या पडताळणीनंतर निश्चित केली जाते.";
                } else {
                    return "🎯 **Eligibility Criteria for " + schemeName + ":**\n\n" +
                           (eligibilityRules != null ? eligibilityRules.trim() : "Standard category and income criteria apply.") + "\n\n" +
                           (schemeBenefit != null ? "🎁 **Benefit:** " + schemeBenefit + "\n\n" : "") +
                           "💡 **Tip:** Our deterministic matching engine checks these conditions against your citizen profile automatically. Final verification is conducted by the concerned government department.";
                }
            } else {
                return "Eligibility depends on factors such as your beneficiary category (Student, Farmer, Business Owner), domicile state, and annual family income ceiling.\n\nComplete your **Citizen Profile** to see automatic matches with full auditable rule evaluations for 30+ schemes!";
            }
        }

        // 4. Application Steps / How to Apply
        if (msg.contains("how to apply") || msg.contains("application") || msg.contains("apply") ||
            msg.contains("process") || msg.contains("steps") || msg.contains("अर्ज") || msg.contains("आवेदन")) {

            if (schemeName != null) {
                String portalLink = schemeSource != null ? "[" + schemeSource + "](" + schemeSource + ")" : "the official government portal";
                if (isMarathi) {
                    return "📝 **" + schemeName + " साठी अर्ज करण्याची पद्धत:**\n\n" +
                           (applicationSteps != null ? applicationSteps.trim() : "1. अधिकृत पोर्टलवर नोंदणी करा.\n2. आवश्यक कागदपत्रे अपलोड करा.\n3. अर्ज सबमिट करून पोचपावती ठेवा.") + "\n\n" +
                           "🌐 **अधिकृत संकेतस्थळ:** " + portalLink;
                } else {
                    return "📝 **How to Apply for " + schemeName + ":**\n\n" +
                           (applicationSteps != null ? applicationSteps.trim() : "1. Register on the official portal.\n2. Upload your verified in-hand documents.\n3. Submit application and download acknowledgment receipt.") + "\n\n" +
                           "🌐 **Official Portal:** " + portalLink + "\n\n" +
                           "⚠️ **Notice:** Never pay middlemen or unauthorized agents. Government scheme discovery and citizen assistance on JanSahay is 100% free.";
                }
            }
        }

        // 5. Helpline Numbers
        if (msg.contains("helpline") || msg.contains("contact") || msg.contains("toll free") ||
            msg.contains("number") || msg.contains("हेल्पलाइन") || msg.contains("संपर्क")) {
            return "📞 **Official Government Helpline Directory:**\n\n" +
                   "• **PM-KISAN Helpline:** 155261 / 1800-115-526 / 011-24300606\n" +
                   "• **MahaDBT Scholarship Helpline (Maharashtra):** 022-49150800\n" +
                   "• **Ayushman Bharat PM-JAY National Toll-Free:** 14555 / 1800-111-565\n" +
                   "• **National Scholarship Portal (NSP):** 0120-6619540\n" +
                   "• **Mudra Bank Mitra Helpline:** 1800-180-1111 / 1800-11-0001\n" +
                   "• **UIDAI Aadhaar Helpline:** 1947\n" +
                   "• **Kisan Call Center (Agriculture Queries):** 1800-180-1551\n" +
                   "• **Jan Dhan - Banking Grievances:** 1800-180-1111";
        }

        // 6. Specific Scheme Queries (e.g. Ladki Bahin, PM-KISAN, EBC, Mudra)
        if (schemeName != null) {
            if (isMarathi) {
                return "ℹ️ **" + schemeName + " बद्दल माहिती:**\n\n" +
                       (schemeDesc != null ? schemeDesc + "\n\n" : "") +
                       "🎁 **फायदा:** " + (schemeBenefit != null ? schemeBenefit : "शासकीय नियमांनुसार आर्थिक सहाय्य") + "\n\n" +
                       (schemeSource != null ? "🌐 **अधिकृत पोर्टल:** [" + schemeSource + "](" + schemeSource + ")" : "");
            } else {
                return "ℹ️ **About " + schemeName + ":**\n\n" +
                       (schemeDesc != null ? schemeDesc + "\n\n" : "") +
                       "🎁 **Key Benefit:** " + (schemeBenefit != null ? schemeBenefit : "Financial and welfare support as per guidelines") + "\n\n" +
                       (schemeSource != null ? "🌐 **Official Portal:** [" + schemeSource + "](" + schemeSource + ")\n\n" : "") +
                       "You can ask me about required documents, eligibility rules, or how to apply!";
            }
        }

        // 7. General Welcome / Fallback
        if (isMarathi) {
            return "🙏 **जनसहाय AI सहाय्यकामध्ये आपले स्वागत आहे!**\n\n" +
                   "मी केंद्र आणि राज्य शासनाच्या 30+ योजना, आवश्यक कागदपत्रे आणि अर्ज प्रक्रियेबद्दल अचूक माहिती देऊ शकतो.\n\n" +
                   "तुम्ही विचारू शकता:\n" +
                   "• *'माझ्याकडे कोणती कागदपत्रे उपलब्ध आहेत?'*\n" +
                   "• *'PM-KISAN योजनेसाठी पात्रता काय आहे?'*\n" +
                   "• *'EBC शिष्यवृत्तीसाठी अर्ज कसा करावा?'*\n" +
                   "• *'लाडकी बहीण योजनेचे फायदे काय आहेत?'*";
        } else if (isHindi) {
            return "🙏 **जनसहाय AI सहायक में आपका स्वागत है!**\n\n" +
                   "मैं सरकारी योजनाओं, आवश्यक दस्तावेजों और आवेदन प्रक्रियाओं के बारे में सत्यापित जानकारी प्रदान करता हूँ।\n\n" +
                   "आप पूछ सकते हैं:\n" +
                   "• *'मेरे पास कौन से दस्तावेज हैं?'*\n" +
                   "• *'पीएम-किसान योजना के लिए पात्रता क्या है?'*\n" +
                   "• *'मुद्रा लोन के लिए आवेदन कैसे करें?'*";
        } else {
            return "👋 **Hello! I am JanSahay AI Assistant.**\n\n" +
                   "I provide verified information on **Central and State welfare schemes**, document readiness, and official application procedures.\n\n" +
                   "You can ask me:\n" +
                   "• *'Which documents do I currently have in hand?'*\n" +
                   "• *'What documents are required for PM-KISAN?'*\n" +
                   "• *'How do I apply for Rajarshi Shahu Maharaj EBC Scholarship?'*\n" +
                   "• *'What are the official helpline numbers?'*";
        }
    }

    @Override
    public boolean isAvailable() { return true; }

    @Override
    public String getProviderName() { return "JanSahay Grounded Engine"; }

    private boolean isMarathiLanguage(String text) {
        if (text == null) return false;
        String lower = text.toLowerCase();
        return lower.contains("marathi") || lower.contains("मराठी") || lower.contains("माझ्याकडे") ||
               lower.contains("कागदपत्रे") || lower.contains("कागदपत्र") || lower.contains("योजना") ||
               lower.contains("आहे") || lower.contains("आहेत") || lower.contains("सांगा") ||
               lower.contains("शेतकरी") || lower.contains("शिष्यवृत्ती") || lower.contains("करावा") ||
               lower.contains("लागतील") || lower.contains("ahet") || lower.contains("ahe") ||
               lower.contains("sheti") || lower.contains("kiti") || lower.contains("pahije");
    }

    private boolean isHindiLanguage(String text) {
        if (text == null) return false;
        String lower = text.toLowerCase();
        return lower.contains("hindi") || lower.contains("हिंदी") || lower.contains("दस्तावेज") ||
               lower.contains("आवेदन") || lower.contains("बताइए") || lower.contains("किसान") ||
               lower.contains("छात्रवृत्ति") || lower.contains("चाहिए") || lower.contains("योजना") ||
               lower.contains("है") || lower.contains("हैं");
    }

    private String extractLine(String text, String prefix) {
        if (text == null) return null;
        for (String line : text.split("\n")) {
            if (line.trim().startsWith(prefix)) {
                return line.trim().substring(prefix.length()).trim();
            }
        }
        return null;
    }

    private String extractSection(String text, String startMarker, String endMarker) {
        if (text == null) return null;
        int start = text.indexOf(startMarker);
        if (start == -1) return null;
        int end = text.indexOf(endMarker, start + startMarker.length());
        if (end == -1) {
            return text.substring(start + startMarker.length()).trim();
        }
        return text.substring(start + startMarker.length(), end).trim();
    }

    private String formatBulletList(String commaOrPipeSeparated) {
        String cleaned = commaOrPipeSeparated.replace("Documents Currently in Hand", "")
                .replaceAll("^\\s*\\([0-9]+\\s*ready\\):\\s*", "")
                .trim();
        String[] parts = cleaned.split("[,\\|]");
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            String item = p.trim();
            if (!item.isEmpty()) {
                sb.append("• ").append(item).append("\n");
            }
        }
        return sb.toString().trim();
    }
}
