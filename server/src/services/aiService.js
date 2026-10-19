/**
 * aiService.js — JanSahay AI Assistant
 *
 * Priority order for AI responses:
 *  1. Gemini 1.5 Flash (if GEMINI_API_KEY is set)
 *  2. Groq Llama-3 (if GROQ_API_KEY is set — free at console.groq.com)
 *  3. Enhanced deterministic engine (always works, no API key needed)
 *
 * The deterministic engine covers 60+ question patterns in EN / HI / MR
 * and is grounded in the verified JanSahay knowledge base.
 */

import { db } from '../db/database.js';
import { config } from '../config.js';
import axios from 'axios';

// ─── Context builder ──────────────────────────────────────────────────────────

export class AIService {
  static buildContext(schemeId, userProfile = null) {
    let ctx = 'GROUNDED OFFICIAL INFORMATION BASE:\n';

    if (schemeId) {
      const scheme = db.findById('schemes', schemeId);
      if (scheme) {
        ctx += `\nSCHEME: ${scheme.name}\n`;
        ctx += `CATEGORY: ${scheme.category} | LEVEL: ${scheme.governmentLevel} | STATE: ${scheme.state || 'All India'}\n`;
        ctx += `DESCRIPTION: ${scheme.description}\n`;
        ctx += `BENEFITS: ${scheme.benefit}\n`;
        ctx += `OFFICIAL PORTAL: ${scheme.sourceUrl}\n`;
        ctx += `LAST VERIFIED: ${scheme.lastVerified}\n`;
        if (scheme.rules?.length) {
          ctx += `ELIGIBILITY:\n`;
          scheme.rules.forEach(r => {
            ctx += `  - ${r.description || (r.field + ' ' + r.operator + ' ' + r.value)}\n`;
          });
        }
        if (scheme.requiredDocuments?.length) {
          ctx += `REQUIRED DOCUMENTS:\n`;
          scheme.requiredDocuments.forEach(d => {
            ctx += `  - ${d.documentName} (${d.purpose || 'Verification'}, issued by: ${d.issuingAuthority || 'Govt'})\n`;
          });
        }
        if (scheme.applicationGuides?.length) {
          ctx += `APPLICATION STEPS:\n`;
          scheme.applicationGuides.forEach(s => {
            ctx += `  Step ${s.stepNumber}: ${s.title} → ${s.instruction}\n`;
          });
        }
      }
    }

    // Add all schemes summary for general questions
    const allSchemes = db.find('schemes') || [];
    if (!schemeId && allSchemes.length) {
      ctx += `\nAVAILABLE SCHEMES IN DATABASE (${allSchemes.length} total):\n`;
      allSchemes.slice(0, 20).forEach(s => {
        ctx += `  - [${s.category}] ${s.name} — ${s.benefit?.substring(0, 80) || 'See portal'} (${s.sourceUrl})\n`;
      });
    }

    // Add doc guides
    const guides = db.find('documentGuides') || [];
    if (guides.length) {
      ctx += `\nDOCUMENT GUIDES (${guides.length} guides available):\n`;
      guides.forEach(g => {
        ctx += `  - ${g.title}: Apply at ${g.officialApplicationUrl} | Fees: ${g.possibleFees} | Time: ${g.expectedProcessingTime}\n`;
      });
    }

    if (userProfile) {
      ctx += `\nCITIZEN PROFILE: Category=${userProfile.category}, State=${userProfile.state}, District=${userProfile.district}, Income=${userProfile.incomeRange}\n`;
    }

    return ctx;
  }

  // ─── Deterministic enhanced engine ─────────────────────────────────────────

  static generateDeterministicAnswer(question, schemeId, language = 'en', userProfile = null) {
    const q = question.toLowerCase().trim();
    const scheme = schemeId ? db.findById('schemes', schemeId) : null;
    const allSchemes = db.find('schemes') || [];
    const guides = db.find('documentGuides') || [];

    // ── Language detection ──────────────────────────────────────────────────
    const isMarathi = language === 'mr' || q.includes('मराठी') || q.includes('marathi') ||
      /[\u0900-\u097F]/.test(question) && !q.includes('hindi');
    const isHindi = language === 'hi' || q.includes('हिंदी') || q.includes('hindi') ||
      q.includes('kya') || q.includes('kaise') || q.includes('chahiye') || q.includes('mein');

    // ── Helper: find a document guide by keyword ────────────────────────────
    function findGuide(keywords) {
      for (const kw of keywords) {
        const g = guides.find(g2 => g2.documentType?.toLowerCase().includes(kw) || g2.title?.toLowerCase().includes(kw));
        if (g) return g;
      }
      return null;
    }

    // ── Helper: find schemes by keyword ────────────────────────────────────
    function findSchemes(keywords) {
      return allSchemes.filter(s =>
        keywords.some(kw =>
          s.name?.toLowerCase().includes(kw) ||
          s.description?.toLowerCase().includes(kw) ||
          s.category?.toLowerCase().includes(kw)
        )
      ).slice(0, 5);
    }

    // ── 1. Greetings ────────────────────────────────────────────────────────
    if (/^(hi|hello|hey|namaste|namaskar|vanakkam|kem cho|sat sri akal|hallo)\b/.test(q)) {
      return {
        answer: `**नमस्ते! Welcome to JanSahay AI Assistant!** 🙏\n\n` +
          `I am an AI assistant helping Indian citizens discover and apply for **${allSchemes.length}+ government welfare schemes**.\n\n` +
          `I can help you with:\n` +
          `• 🎓 **Education Scholarships** — MahaDBT, NSP, EBC, OBC scholarships\n` +
          `• 🌾 **Farmer Schemes** — PM-KISAN, Namo Shetkari, crop insurance\n` +
          `• 💼 **Business Loans** — PM Mudra, Stand-Up India, CMEGP\n` +
          `• 🏥 **Health Schemes** — Ayushman Bharat, PM-JAY\n` +
          `• 🏠 **Housing** — PMAY, Gharkul Yojana\n` +
          `• 📋 **Documents** — Income certificate, Domicile, Caste, 7/12\n\n` +
          `Ask me anything! You can also ask in **हिंदी** or **मराठी**. 😊`,
        provider: 'JanSahay AI Assistant',
        isVerified: true
      };
    }

    // ── 2. Marathi responses ────────────────────────────────────────────────
    if (isMarathi) {
      if (scheme) {
        return {
          answer: `**${scheme.name} — मराठीत माहिती:**\n\n` +
            `📌 **योजना काय आहे:** ${scheme.description}\n\n` +
            `💰 **मिळणारा लाभ:** ${scheme.benefit}\n\n` +
            `✅ **पात्रता अटी:**\n${scheme.rules?.map(r => `  • ${r.description}`).join('\n') || '  • सरकारी नियमांनुसार'}\n\n` +
            `📄 **आवश्यक कागदपत्रे:**\n${scheme.requiredDocuments?.map(d => `  • ${d.documentName}`).join('\n') || '  • आधार कार्ड, उत्पन्नाचा दाखला'}\n\n` +
            `🌐 **अर्ज कुठे करावा:** [${scheme.sourceUrl}](${scheme.sourceUrl})\n\n` +
            `⚠️ *टीप: अर्ज करण्यापूर्वी अधिकृत सरकारी संकेतस्थळावर नवीनतम नियम तपासा.*`,
          provider: 'JanSahay AI (मराठी)',
          isVerified: true
        };
      }

      // Marathi document help
      const marGuide = q.includes('उत्पन्न') || q.includes('income') ? findGuide(['income']) :
        q.includes('जात') || q.includes('caste') ? findGuide(['caste']) :
          q.includes('अधिवास') || q.includes('domicile') ? findGuide(['domicile']) :
            q.includes('सातबारा') || q.includes('7/12') ? findGuide(['seven', '7']) : null;

      if (marGuide) {
        return {
          answer: `**${marGuide.title} — मराठीत मार्गदर्शन:**\n\n` +
            `🏛️ **जारी करणारी संस्था:** ${marGuide.issuingAuthority}\n` +
            `🌐 **ऑनलाइन अर्ज:** [${marGuide.officialApplicationUrl}](${marGuide.officialApplicationUrl})\n` +
            `📄 **लागणारी कागदपत्रे:**\n${marGuide.requiredSupportingDocuments?.map(d => `  • ${d}`).join('\n') || ''}\n` +
            `💳 **शुल्क:** ${marGuide.possibleFees}\n` +
            `⏱️ **वेळ:** ${marGuide.expectedProcessingTime}\n\n` +
            `*स्रोत: जनसहाय AI सत्यापित ज्ञान आधार*`,
          provider: 'JanSahay AI (मराठी)',
          isVerified: true,
          officialUrl: marGuide.officialApplicationUrl
        };
      }

      return {
        answer: `**जनसहाय AI मध्ये आपले स्वागत आहे!** 🙏\n\nमी तुम्हाला खालील गोष्टींबद्दल मराठीत मार्गदर्शन करू शकेन:\n\n` +
          `• शेतकरी योजना (PM-KISAN, नमो शेतकरी)\n` +
          `• विद्यार्थी शिष्यवृत्ती (EBC, OBC, MahaDBT)\n` +
          `• व्यवसाय कर्ज (PM Mudra, CMEGP)\n` +
          `• आरोग्य योजना (आयुष्मान भारत)\n` +
          `• कागदपत्रे (उत्पन्न दाखला, जात प्रमाणपत्र, सातबारा)\n\n` +
          `कृपया योजनेचे नाव किंवा तुमची श्रेणी (विद्यार्थी/शेतकरी/व्यावसायिक) सांगा.`,
        provider: 'JanSahay AI (मराठी)',
        isVerified: true
      };
    }

    // ── 3. Hindi responses ──────────────────────────────────────────────────
    if (isHindi) {
      if (scheme) {
        return {
          answer: `**${scheme.name} — हिंदी में जानकारी:**\n\n` +
            `📌 **योजना का उद्देश्य:** ${scheme.description}\n\n` +
            `💰 **मुख्य लाभ:** ${scheme.benefit}\n\n` +
            `✅ **पात्रता शर्तें:**\n${scheme.rules?.map(r => `  • ${r.description}`).join('\n') || '  • सरकारी नियमों के अनुसार'}\n\n` +
            `📄 **आवश्यक दस्तावेज़:**\n${scheme.requiredDocuments?.map(d => `  • ${d.documentName}`).join('\n') || '  • आधार कार्ड, आय प्रमाण पत्र'}\n\n` +
            `🌐 **आवेदन पोर्टल:** [${scheme.sourceUrl}](${scheme.sourceUrl})\n\n` +
            `⚠️ *अस्वीकरण: आवेदन करने से पहले आधिकारिक सरकारी वेबसाइट पर नवीनतम नियम जांचें।*`,
          provider: 'JanSahay AI (हिंदी)',
          isVerified: true
        };
      }

      const hindiDocKW =
        q.includes('aay') || q.includes('income') || q.includes('utpann') ? ['income'] :
          q.includes('jati') || q.includes('jaat') || q.includes('caste') ? ['caste'] :
            q.includes('niwas') || q.includes('domicile') || q.includes('adiwas') ? ['domicile'] :
              q.includes('7/12') || q.includes('satbara') || q.includes('land') ? ['seven', '7'] :
                q.includes('udyam') || q.includes('msme') ? ['udyam'] : null;

      if (hindiDocKW) {
        const guide = findGuide(hindiDocKW);
        if (guide) {
          return {
            answer: `**${guide.title} — हिंदी में मार्गदर्शन:**\n\n` +
              `🏛️ **जारी करने वाला प्राधिकरण:** ${guide.issuingAuthority}\n` +
              `🌐 **ऑनलाइन आवेदन:** [${guide.officialApplicationUrl}](${guide.officialApplicationUrl})\n` +
              `📄 **आवश्यक दस्तावेज़:**\n${guide.requiredSupportingDocuments?.map(d => `  • ${d}`).join('\n') || ''}\n` +
              `💳 **शुल्क:** ${guide.possibleFees}\n` +
              `⏱️ **समय:** ${guide.expectedProcessingTime}\n\n` +
              `*स्रोत: जनसहाय AI सत्यापित ज्ञान आधार — ${guide.lastVerifiedAt}*`,
            provider: 'JanSahay AI (हिंदी)',
            isVerified: true,
            officialUrl: guide.officialApplicationUrl
          };
        }
      }

      // Hindi scheme search
      const hindiSchemeKW =
        q.includes('kisan') || q.includes('fasal') ? ['pm-kisan', 'farmer', 'kisan'] :
          q.includes('mudra') || q.includes('loan') || q.includes('vyavsay') ? ['mudra', 'business', 'loan'] :
            q.includes('ayushman') || q.includes('swasthya') ? ['health', 'ayushman'] :
              q.includes('awas') || q.includes('ghar') ? ['housing', 'awas', 'pmay'] : null;

      if (hindiSchemeKW) {
        const foundSchemes = findSchemes(hindiSchemeKW);
        if (foundSchemes.length) {
          return {
            answer: `**संबंधित सरकारी योजनाएं (हिंदी में):**\n\n` +
              foundSchemes.map((s, i) =>
                `${i + 1}. **${s.name}**\n   💰 ${s.benefit?.substring(0, 150)}\n   🌐 [आवेदन करें](${s.sourceUrl})`
              ).join('\n\n'),
            provider: 'JanSahay AI (हिंदी)',
            isVerified: true
          };
        }
      }

      return {
        answer: `**जनसहाय AI में आपका स्वागत है!** 🙏\n\nमैं आपको इन विषयों पर हिंदी में सटीक जानकारी दे सकता हूँ:\n\n` +
          `• 🌾 किसान योजनाएं (PM-KISAN, नमो शेतकरी)\n` +
          `• 🎓 छात्रवृत्ति (EBC, OBC, NSP)\n` +
          `• 💼 व्यापार ऋण (Mudra, CMEGP, Stand-Up India)\n` +
          `• 🏥 स्वास्थ्य योजनाएं (आयुष्मान भारत)\n` +
          `• 📋 दस्तावेज़ (आय प्रमाण पत्र, जाति प्रमाण पत्र, 7/12)\n\n` +
          `उदाहरण पूछें: *"PM-KISAN के लिए क्या दस्तावेज़ चाहिए?"* या *"आय प्रमाण पत्र कैसे बनवाएं?"*`,
        provider: 'JanSahay AI (हिंदी)',
        isVerified: true
      };
    }

    // ── 4. Recommendation explanation ──────────────────────────────────────
    if (q.includes('why') && (q.includes('recommend') || q.includes('match') || q.includes('eligible') || q.includes('suggest'))) {
      if (scheme && userProfile) {
        return {
          answer: `**Why "${scheme.name}" is recommended for you:**\n\n` +
            `1. 👤 **Profile Match:** You registered as **${userProfile.category}** — this scheme targets ${scheme.targetBeneficiaries || 'your category'}.\n` +
            `2. 📍 **State Eligibility:** You reside in **${userProfile.state}** (scheme covers: ${scheme.state || 'All India'}).\n` +
            `3. 💰 **Income Eligibility:** Your income range (**${userProfile.incomeRange}**) falls within the eligible criteria.\n` +
            `4. 🎯 **Category Alignment:** ${scheme.rules?.find(r => r.description)?.description || 'Conditions match your profile.'}\n\n` +
            `**Next step:** Review the document checklist and acquire any missing certificates.\n` +
            `**Apply at:** [${scheme.sourceUrl}](${scheme.sourceUrl})`,
          provider: 'JanSahay Eligibility Engine',
          isVerified: true
        };
      }
    }

    // ── 5. Document acquisition questions ──────────────────────────────────
    const docPatterns = [
      { keywords: ['income certificate', 'income proof', 'income cert', 'utpann', 'उत्पन्न'], type: 'income' },
      { keywords: ['domicile', 'residence certificate', 'nivaas', 'adhibas', 'bonafide resident'], type: 'domicile' },
      { keywords: ['caste certificate', 'caste cert', 'jati', 'sc certificate', 'obc certificate', 'cast cert'], type: 'caste' },
      { keywords: ['7/12', 'satbara', 'land record', 'bhulekh', 'mahabhumi', 'saat baara'], type: 'seven' },
      { keywords: ['udyam', 'msme registration', 'msme cert', 'udyog aadhar'], type: 'udyam' },
      { keywords: ['non creamy layer', 'ncl', 'non-creamy', 'obc certificate income'], type: 'non_creamy' },
      { keywords: ['disability certificate', 'udid', 'divyang', 'handicap cert'], type: 'disability' },
      { keywords: ['ration card', 'bpl card', 'family card', 'antyodaya'], type: 'ration' },
      { keywords: ['caste validity', 'jaat validity', 'scrutiny committee', 'barti'], type: 'caste_validity' },
      { keywords: ['bonafide', 'college certificate', 'student certificate', 'enrollment cert'], type: 'bonafide' },
    ];

    for (const pat of docPatterns) {
      if (pat.keywords.some(kw => q.includes(kw))) {
        const guide = guides.find(g =>
          g.documentType?.toLowerCase().includes(pat.type) ||
          g.title?.toLowerCase().includes(pat.type.replace('_', ' '))
        );
        if (guide) {
          return {
            answer: `**How to obtain: ${guide.title}**\n\n` +
              `🏛️ **Issuing Authority:** ${guide.issuingAuthority}\n` +
              `🌐 **Official Portal:** [${guide.officialApplicationUrl}](${guide.officialApplicationUrl})\n` +
              `📋 **Nearest CSC/Seva Kendra:** Available at your Tehsildar / Sub-Divisional Office\n\n` +
              `📄 **Documents Required:**\n${guide.requiredSupportingDocuments?.map(d => `  • ${d}`).join('\n')}\n\n` +
              `💳 **Government Fees:** ${guide.possibleFees}\n` +
              `⏱️ **Processing Time:** ${guide.expectedProcessingTime}\n` +
              `✅ **Last Verified:** ${guide.lastVerifiedAt}\n\n` +
              (guide.additionalNotes ? `ℹ️ **Important Note:** ${guide.additionalNotes}` : ''),
            provider: 'JanSahay Document Guide Engine',
            isVerified: true,
            guideId: guide.id,
            officialUrl: guide.officialApplicationUrl
          };
        }
      }
    }

    // ── 6. Scheme search by keyword ────────────────────────────────────────
    const schemeSearchPatterns = [
      { kws: ['farmer', 'agriculture', 'kisan', 'crop', 'farming', 'pm kisan', 'pm-kisan'], cat: 'AGRICULTURE' },
      { kws: ['scholarship', 'student', 'education', 'college', 'school', 'mahadbt', 'ebc'], cat: 'EDUCATION' },
      { kws: ['business', 'msme', 'loan', 'mudra', 'startup', 'entrepreneur', 'shop'], cat: 'BUSINESS' },
      { kws: ['health', 'hospital', 'medical', 'ayushman', 'insurance', 'pm-jay'], cat: 'HEALTH' },
      { kws: ['housing', 'house', 'home', 'pmay', 'awas', 'gharkul'], cat: 'HOUSING' },
      { kws: ['women', 'girl', 'mahila', 'maternity', 'beti', 'widow'], cat: 'WELFARE' },
      { kws: ['pension', 'senior', 'old age', 'atal pension', 'nps'], cat: 'WELFARE' },
    ];

    for (const pat of schemeSearchPatterns) {
      if (pat.kws.some(kw => q.includes(kw))) {
        const matches = allSchemes.filter(s =>
          s.category === pat.cat ||
          pat.kws.some(kw => s.name?.toLowerCase().includes(kw) || s.description?.toLowerCase().includes(kw))
        ).slice(0, 6);

        if (matches.length) {
          return {
            answer: `**Government Schemes — ${pat.cat.charAt(0) + pat.cat.slice(1).toLowerCase()} Category:**\n\n` +
              matches.map((s, i) =>
                `**${i + 1}. ${s.name}**\n` +
                `  💰 *Benefit:* ${s.benefit?.substring(0, 120) || 'See portal'}\n` +
                `  📍 *Coverage:* ${s.state || 'All India'} | ${s.governmentLevel} Government\n` +
                `  🌐 [Apply / Know More](${s.sourceUrl})\n`
              ).join('\n') +
              `\n\n*${allSchemes.length} schemes total in JanSahay database. Ask about any specific scheme for detailed eligibility and document requirements.*`,
            provider: 'JanSahay Scheme Catalog',
            isVerified: true
          };
        }
      }
    }

    // ── 7. How to apply for a specific named scheme ────────────────────────
    const namedSchemePatterns = [
      { names: ['pm-kisan', 'pm kisan', 'kisan samman'], keywords: ['pm-kisan', 'kisan'] },
      { names: ['mudra', 'pmmy'], keywords: ['mudra', 'business'] },
      { names: ['ayushman', 'pm-jay', 'pmjay'], keywords: ['health', 'ayushman'] },
      { names: ['pmay', 'pradhan mantri awas', 'housing for all'], keywords: ['housing', 'awas'] },
      { names: ['mahadbt', 'ebc scholarship', 'obc scholarship'], keywords: ['education', 'scholarship'] },
      { names: ['stand up india', 'standup india'], keywords: ['standup', 'sc/st business'] },
      { names: ['sukanya samriddhi', 'beti bachao', 'girl child'], keywords: ['women', 'girl'] },
    ];

    for (const pat of namedSchemePatterns) {
      if (pat.names.some(n => q.includes(n))) {
        const matched = allSchemes.find(s =>
          pat.keywords.some(kw => s.name?.toLowerCase().includes(kw) || s.description?.toLowerCase().includes(kw))
        );
        if (matched) {
          return {
            answer: `**${matched.name}**\n\n` +
              `📌 **About:** ${matched.description}\n\n` +
              `💰 **Benefits:** ${matched.benefit}\n\n` +
              `📍 **Coverage:** ${matched.state || 'All India'} | ${matched.governmentLevel} Government\n\n` +
              `✅ **Eligibility:** ${matched.rules?.map(r => r.description).join(', ') || 'As per scheme guidelines'}\n\n` +
              `📄 **Required Documents:**\n${matched.requiredDocuments?.map(d => `  • ${d.documentName}`).join('\n') || '  • Aadhaar Card, Bank Passbook'}\n\n` +
              `🔗 **Apply / Know More:** [${matched.sourceUrl}](${matched.sourceUrl})\n\n` +
              (matched.applicationGuides?.length ? `**Application Steps:**\n${matched.applicationGuides.map(g => `  Step ${g.stepNumber}: ${g.title} — ${g.instruction}`).join('\n')}` : ''),
            provider: 'JanSahay Verified Scheme Assistant',
            isVerified: true
          };
        }
      }
    }

    // ── 8. Eligibility checker ─────────────────────────────────────────────
    if (q.includes('eligible') || q.includes('eligibility') || q.includes('qualify') || q.includes('can i apply')) {
      if (scheme) {
        return {
          answer: `**Eligibility for ${scheme.name}:**\n\n` +
            `✅ **Conditions to meet:**\n${scheme.rules?.map(r => `  • ${r.description}`).join('\n') || '  • As per government guidelines'}\n\n` +
            `📋 **You will need these documents:**\n${scheme.requiredDocuments?.map(d => `  • ${d.documentName}`).join('\n') || '  • Standard KYC documents'}\n\n` +
            `🔗 **Verify & Apply:** [${scheme.sourceUrl}](${scheme.sourceUrl})\n\n` +
            `💡 *Tip: Log in and complete your profile on JanSahay to get an automated eligibility check.*`,
          provider: 'JanSahay Eligibility Engine',
          isVerified: true
        };
      }
    }

    // ── 9. Application process / how to apply ──────────────────────────────
    if (q.includes('how to apply') || q.includes('apply online') || q.includes('apply for') || q.includes('application process') || q.includes('kaise apply')) {
      if (scheme) {
        const steps = scheme.applicationGuides || [];
        return {
          answer: `**How to Apply for ${scheme.name}:**\n\n` +
            (steps.length
              ? steps.map(s => `**Step ${s.stepNumber}: ${s.title}**\n${s.instruction}`).join('\n\n')
              : `Visit the official portal at [${scheme.sourceUrl}](${scheme.sourceUrl}) and complete the online application form with your Aadhaar-linked details.`
            ) + `\n\n🌐 **Official Portal:** [${scheme.sourceUrl}](${scheme.sourceUrl})`,
          provider: 'JanSahay Application Guide',
          isVerified: true
        };
      }
    }

    // ── 10. How many schemes / what schemes do we have ─────────────────────
    if (q.includes('how many scheme') || q.includes('list of scheme') || q.includes('available scheme') || q.includes('what scheme') || q.includes('show scheme')) {
      const catCounts = {};
      allSchemes.forEach(s => { catCounts[s.category] = (catCounts[s.category] || 0) + 1; });
      return {
        answer: `**JanSahay Scheme Database — ${allSchemes.length} Verified Government Schemes:**\n\n` +
          Object.entries(catCounts).map(([cat, count]) =>
            `  • **${cat}**: ${count} schemes`
          ).join('\n') +
          `\n\n**Featured Schemes:**\n` +
          allSchemes.slice(0, 8).map((s, i) => `  ${i + 1}. ${s.name} — [Apply](${s.sourceUrl})`).join('\n') +
          `\n\n*Visit the Schemes Catalog page or ask about any specific category.*`,
        provider: 'JanSahay Database',
        isVerified: true
      };
    }

    // ── 11. Contact / official portal questions ─────────────────────────────
    if (q.includes('contact') || q.includes('helpline') || q.includes('phone number') || q.includes('toll free') || q.includes('customer care')) {
      return {
        answer: `**Official Government Helplines:**\n\n` +
          `• 📞 **PM-KISAN Helpline:** 155261 / 1800-115-526\n` +
          `• 📞 **MahaDBT (Maharashtra Scholarships):** 022-49150800\n` +
          `• 📞 **Ayushman Bharat (PM-JAY):** 14555 / 1800-111-565\n` +
          `• 📞 **PM Mudra (Business Loans):** 1800-180-1111\n` +
          `• 📞 **NSP Scholarship:** 0120-6619540\n` +
          `• 📞 **Udyam MSME:** 1800-111-955\n` +
          `• 📞 **UMANG (All Schemes):** 1800-113-888\n` +
          `• 🌐 **MyScheme Portal:** [myscheme.gov.in](https://www.myscheme.gov.in)\n` +
          `• 🌐 **India.gov.in:** [india.gov.in](https://india.gov.in)`,
        provider: 'JanSahay Official Directory',
        isVerified: true
      };
    }

    // ── 12. Default / specific scheme context ──────────────────────────────
    if (scheme) {
      return {
        answer: `**${scheme.name}**\n\n` +
          `📌 **Overview:** ${scheme.description}\n\n` +
          `💰 **Benefit:** ${scheme.benefit}\n\n` +
          `📍 **Jurisdiction:** ${scheme.governmentLevel} Government | ${scheme.state || 'All India'}\n\n` +
          `🌐 **Official Portal:** [${scheme.sourceUrl}](${scheme.sourceUrl})\n` +
          `✅ **Last Verified:** ${scheme.lastVerified}\n\n` +
          `You can ask me:\n` +
          `  • *"Am I eligible for this scheme?"*\n` +
          `  • *"What documents do I need?"*\n` +
          `  • *"How do I apply step by step?"*\n` +
          `  • *"मराठीत माहिती द्या"* (Explain in Marathi)\n` +
          `  • *"हिंदी में बताइए"* (Explain in Hindi)`,
        provider: 'JanSahay Scheme Assistant',
        isVerified: true
      };
    }

    // ── 13. General fallback ────────────────────────────────────────────────
    return {
      answer: `**JanSahay AI — Your Government Scheme Assistant** 🇮🇳\n\n` +
        `I currently have **${allSchemes.length} government schemes** in my database.\n\n` +
        `**Try asking:**\n` +
        `  • *"What schemes are available for farmers?"*\n` +
        `  • *"How do I get an income certificate in Maharashtra?"*\n` +
        `  • *"What documents do I need for PM-KISAN?"*\n` +
        `  • *"Am I eligible for Ayushman Bharat?"*\n` +
        `  • *"Show me education scholarships"*\n` +
        `  • *"मराठीत माहिती द्या"* or *"हिंदी में बताइए"*\n\n` +
        `You can also use the **Schemes Catalog** to browse all schemes, or complete your **Profile** for personalized recommendations.`,
      provider: 'JanSahay AI Assistant',
      isVerified: true
    };
  }

  // ─── Groq AI (free Llama 3) ─────────────────────────────────────────────────

  static async callGroq(question, context) {
    if (!config.groqApiKey) return null;

    const systemPrompt = `You are JanSahay AI, an official citizen assistance AI for Indian government welfare schemes.

STRICT RULES:
1. ONLY use facts from the verified context below.
2. NEVER invent fees, deadlines, or URLs not in the context.
3. If information is absent, say: "Please verify at the official government portal."
4. If asked in Hindi → respond in Hindi. If Marathi → respond in Marathi. Else English.
5. Always include the official portal URL for any scheme.
6. Format responses with clear headings and bullet points.
7. Be concise, helpful, and citizen-friendly.

${context}`;

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question }
          ],
          max_tokens: 1024,
          temperature: 0.3,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.groqApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      const text = response.data?.choices?.[0]?.message?.content;
      if (text) {
        return {
          answer: text,
          provider: 'Llama 3 via Groq (Grounded in JanSahay DB)',
          isVerified: true
        };
      }
    } catch (err) {
      console.warn('[AI] Groq API error:', err.response?.data?.error?.message || err.message);
    }
    return null;
  }

  // ─── Gemini AI ──────────────────────────────────────────────────────────────

  static async callGemini(question, context) {
    if (!config.geminiApiKey) return null;

    const systemPrompt = `You are JanSahay AI, an official citizen assistance AI for Indian government welfare schemes.
RULES:
1. ONLY answer using verified facts from the context below.
2. DO NOT invent application fees, deadlines, URLs, or eligibility criteria.
3. If information is not in the context, state: "Detailed instructions not yet verified. Please consult the issuing authority."
4. If asked in Hindi or Marathi, respond fluently in that language.
5. Format with clear headings and bullet points.
\n${context}`;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`,
        {
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nCitizen Question: ${question}` }] }]
        },
        { timeout: 12000 }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return {
          answer: text,
          provider: 'Google Gemini 1.5 Flash (Grounded in JanSahay DB)',
          isVerified: true
        };
      }
    } catch (err) {
      console.warn('[AI] Gemini API error:', err.message);
    }
    return null;
  }

  // ─── Main entry point ───────────────────────────────────────────────────────

  static async answerQuestion(question, schemeId, userId, language = 'en') {
    const profile = userId ? db.findOne('profiles', p => String(p.userId) === String(userId)) : null;
    const context = this.buildContext(schemeId, profile);

    // Try Gemini first (if configured)
    if (config.aiProvider === 'gemini' && config.geminiApiKey) {
      const geminiResult = await this.callGemini(question, context);
      if (geminiResult) return geminiResult;
    }

    // Try Groq (if configured — free tier)
    if (config.groqApiKey) {
      const groqResult = await this.callGroq(question, context);
      if (groqResult) return groqResult;
    }

    // Always-available deterministic engine
    return this.generateDeterministicAnswer(question, schemeId, language, profile);
  }
}
