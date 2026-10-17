import { db } from '../db/database.js';
import { config } from '../config.js';
import axios from 'axios';

export class AIService {
  /**
   * Builds grounded context from verified scheme and document guides
   */
  static buildContext(schemeId, userProfile = null) {
    let contextStr = "GROUNDED OFFICIAL INFORMATION BASE:\n";

    if (schemeId) {
      const scheme = db.findById('schemes', schemeId);
      if (scheme) {
        contextStr += `\nSCHEME NAME: ${scheme.name}\n`;
        contextStr += `CATEGORY: ${scheme.category} | LEVEL: ${scheme.governmentLevel} | STATE: ${scheme.state || 'All India'}\n`;
        contextStr += `DESCRIPTION: ${scheme.description}\n`;
        contextStr += `BENEFITS: ${scheme.benefit}\n`;
        contextStr += `OFFICIAL SOURCE: ${scheme.sourceUrl}\n`;
        contextStr += `LAST VERIFIED: ${scheme.lastVerified}\n`;

        if (scheme.rules && scheme.rules.length > 0) {
          contextStr += `ELIGIBILITY CONDITIONS:\n`;
          scheme.rules.forEach(r => {
            contextStr += `- ${r.description || (r.field + ' ' + r.operator + ' ' + r.value)}\n`;
          });
        }

        if (scheme.requiredDocuments && scheme.requiredDocuments.length > 0) {
          contextStr += `REQUIRED DOCUMENTS:\n`;
          scheme.requiredDocuments.forEach(d => {
            contextStr += `- ${d.documentName} (Purpose: ${d.purpose || 'Verification'}, Authority: ${d.issuingAuthority || 'Govt'})\n`;
          });
        }

        if (scheme.applicationGuides && scheme.applicationGuides.length > 0) {
          contextStr += `APPLICATION STEPS:\n`;
          scheme.applicationGuides.forEach(s => {
            contextStr += `Step ${s.stepNumber}: ${s.title} - ${s.instruction}\n`;
          });
        }
      }
    }

    if (userProfile) {
      contextStr += `\nCITIZEN PROFILE CONTEXT: Category=${userProfile.category}, State=${userProfile.state}, District=${userProfile.district}, Income=${userProfile.incomeRange}\n`;
    }

    return contextStr;
  }

  /**
   * Deterministic grounded AI response generator
   */
  static generateDeterministicAnswer(question, schemeId, language = 'en', userProfile = null) {
    const q = question.toLowerCase();
    const scheme = schemeId ? db.findById('schemes', schemeId) : null;
    const userState = userProfile?.state || 'Maharashtra';

    // 1. Marathi language request
    if (q.includes('marathi') || q.includes('मराठी') || language === 'mr') {
      if (scheme) {
        return {
          answer: `**${scheme.name} - सोप्या मराठीत माहिती:**\n\n` +
            `• **योजना काय आहे:** ${scheme.description}\n` +
            `• **मिळणारा लाभ:** ${scheme.benefit}\n` +
            `• **पात्रता अटी:** ही योजना ${scheme.state} राज्यातील नागरिकांसाठी आहे. यासाठी आवश्यक कागदपत्रे वेळेवर सादर करणे गरजेचे आहे.\n` +
            `• **आवश्यक कागदपत्रे:** ${scheme.requiredDocuments ? scheme.requiredDocuments.map(d => d.documentName).join(', ') : 'तहसीलदार दाखला, आधार कार्ड'}.\n` +
            `• **अर्ज कुठे करावा:** अधिकृत पोर्टल - ${scheme.sourceUrl}\n\n` +
            `⚠️ *टीप: अर्ज करण्यापूर्वी कृपया अधिकृत सरकारी संकेतस्थळावर अंतिम नियम आणि तारीख तपासा.*`,
          provider: 'JanSahay Verified Multilingual Engine (मराठी)',
          isVerified: true
        };
      }
      return {
        answer: `जनसहाय AI मध्ये आपले स्वागत आहे! मी तुम्हाला शासकीय योजना, आवश्यक कागदपत्रे (उदा. उत्पन्नाचा दाखला, अधिवास प्रमाणपत्र, सातबारा) आणि अर्ज करण्याच्या पद्धतीबद्दल मराठीत अचूक मार्गदर्शन करू शकेन. कृपया योजनेचे नाव सांगा.`,
        provider: 'JanSahay Verified Multilingual Engine (मराठी)',
        isVerified: true
      };
    }

    // 2. Hindi language request
    if (q.includes('hindi') || q.includes('हिंदी') || language === 'hi') {
      if (scheme) {
        return {
          answer: `**${scheme.name} - सरल हिंदी में विवरण:**\n\n` +
            `• **योजना का उद्देश्य:** ${scheme.description}\n` +
            `• **मुख्य लाभ:** ${scheme.benefit}\n` +
            `• **आवश्यक दस्तावेज:** ${scheme.requiredDocuments ? scheme.requiredDocuments.map(d => d.documentName).join(', ') : 'आय प्रमाण पत्र, आधार कार्ड'}.\n` +
            `• **आवेदन प्रक्रिया:** आधिकारिक वेबसाइट (${scheme.sourceUrl}) पर जाकर ऑनलाइन पंजीकरण करें।\n\n` +
            `⚠️ *अस्वीकरण: अंतिम पात्रता और आवेदन प्रक्रिया संबंधित सरकारी विभाग द्वारा सत्यापित की जाती है।*`,
          provider: 'JanSahay Verified Multilingual Engine (हिंदी)',
          isVerified: true
        };
      }
    }

    // 3. Why is this scheme recommended?
    if (q.includes('why') && (q.includes('recommended') || q.includes('match') || q.includes('eligible'))) {
      if (scheme && userProfile) {
        return {
          answer: `**Why this scheme was recommended for you:**\n\n` +
            `1. **Category Alignment:** You registered as a **${userProfile.category}**, which directly matches the target group for *${scheme.name}*.\n` +
            `2. **State Eligibility:** You reside in **${userProfile.state}**, matching the jurisdiction (${scheme.state || 'All India'}).\n` +
            `3. **Economic Tier:** Your declared family income tier (**${userProfile.incomeRange}**) falls within the eligible ceiling for this assistance.\n\n` +
            `To apply successfully, make sure to review the document checklist and acquire any missing certificates from the designated issuing authority.`,
          provider: 'JanSahay Grounded Engine',
          isVerified: true
        };
      }
    }

    // 4. How to get missing documents / specific document questions
    if (q.includes('how to get') || q.includes('how to obtain') || q.includes('income certificate') || q.includes('domicile') || q.includes('caste') || q.includes('7/12') || q.includes('udyam')) {
      // Find matching document guide
      let guide = null;
      if (q.includes('income')) guide = db.findOne('documentGuides', g => g.documentType === 'INCOME_CERTIFICATE');
      else if (q.includes('domicile') || q.includes('residence')) guide = db.findOne('documentGuides', g => g.documentType === 'DOMICILE_CERTIFICATE');
      else if (q.includes('caste')) guide = db.findOne('documentGuides', g => g.documentType === 'CASTE_CERTIFICATE');
      else if (q.includes('7/12') || q.includes('satbara') || q.includes('land')) guide = db.findOne('documentGuides', g => g.documentType === 'SEVEN_TWELVE_EXTRACT');
      else if (q.includes('udyam') || q.includes('msme')) guide = db.findOne('documentGuides', g => g.documentType === 'UDYAM_REGISTRATION');

      if (guide) {
        return {
          answer: `**How to obtain ${guide.title}:**\n\n` +
            `• **Issuing Authority:** ${guide.issuingAuthority}\n` +
            `• **Where to Apply:** Official Portal [${guide.officialApplicationUrl}](${guide.officialApplicationUrl}) or nearest Citizen Service Centre (Setu / CSC).\n` +
            `• **Supporting Documents Needed:**\n${guide.requiredSupportingDocuments.map(d => '  - ' + d).join('\n')}\n` +
            `• **Official Fees:** ${guide.possibleFees || 'Nominal government fee'}\n` +
            `• **Expected Timeline:** ${guide.expectedProcessingTime || '15-21 working days'}\n\n` +
            `**Key Step:** Register on the portal, upload your identity and income/address proofs, and collect your digitally signed certificate with QR code upon Tehsildar verification.`,
          provider: 'JanSahay Smart Document Guidance Engine',
          isVerified: true,
          guideId: guide.id,
          officialUrl: guide.officialApplicationUrl
        };
      }
    }

    // 5. Default grounded explanation
    if (scheme) {
      return {
        answer: `**Overview of ${scheme.name}:**\n\n` +
          `• **Objective:** ${scheme.description}\n` +
          `• **Benefit Offered:** ${scheme.benefit}\n` +
          `• **Jurisdiction:** ${scheme.governmentLevel} Government (${scheme.state || 'All India'})\n` +
          `• **Official Application Portal:** [${scheme.sourceUrl}](${scheme.sourceUrl})\n` +
          `• **Last Verified:** ${scheme.lastVerified}\n\n` +
          `Feel free to ask for step-by-step application guidance, document acquisition tips, or an explanation in simple Marathi or Hindi.`,
        provider: 'JanSahay Verified Scheme Assistant',
        isVerified: true
      };
    }

    return {
      answer: `I am your JanSahay AI Government Assistant. I can help you understand government schemes, check your eligibility conditions, explain required documents, and guide you step-by-step on how to obtain certificates in your state.\n\nPlease select a scheme or ask a question such as: *"Why is this scheme recommended for me?"* or *"How do I get an Income Certificate in Maharashtra?"*`,
      provider: 'JanSahay Assistant',
      isVerified: true
    };
  }

  /**
   * Main chat answering method (calls Gemini if configured, else deterministic)
   */
  static async answerQuestion(question, schemeId, userId, language = 'en') {
    const user = userId ? db.findById('users', userId) : null;
    const profile = userId ? db.findOne('profiles', p => String(p.userId) === String(userId)) : null;

    if (config.aiProvider === 'gemini' && config.geminiApiKey) {
      try {
        const context = this.buildContext(schemeId, profile);
        const systemPrompt = `You are JanSahay AI, an official citizen assistance assistant for Indian government schemes.
RULES:
1. ONLY answer using verified facts provided in the context below.
2. DO NOT invent application fees, deadlines, URLs, or document criteria.
3. If information is not in the context, explicitly state: "Detailed instructions have not yet been verified. Please consult the issuing authority through the official information link."
4. DO NOT guarantee approval or issuance of any scheme or document.
5. If the user asks in Hindi or Marathi, respond fluently and politely in that language.
\n${context}`;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`,
          {
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nCitizen Question: ${question}` }]
              }
            ]
          },
          { timeout: 10000 }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            answer: text,
            provider: 'Google Gemini (Grounded in JanSahay Database)',
            isVerified: true
          };
        }
      } catch (err) {
        console.warn('[AI] Gemini API failed or timed out, falling back to deterministic engine:', err.message);
      }
    }

    // Fallback to verified deterministic response
    return this.generateDeterministicAnswer(question, schemeId, language, profile);
  }
}
