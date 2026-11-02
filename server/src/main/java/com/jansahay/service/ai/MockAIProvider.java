package com.jansahay.service.ai;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@ConditionalOnProperty(name = "ai.provider", havingValue = "mock", matchIfMissing = true)
public class MockAIProvider implements AIProvider {

    @Override
    public String generateResponse(String systemPrompt, String userMessage) {
        String msg = userMessage.toLowerCase().trim();
        boolean isMarathi = isMarathiLanguage(userMessage);
        boolean isHindi = !isMarathi && isHindiLanguage(userMessage);

        // Context extractions
        String inHandDocs = extractSection(systemPrompt, "Documents Currently in Hand", "\n\n");
        String schemeName = extractLine(systemPrompt, "name:");
        String schemeDesc = extractLine(systemPrompt, "description:");
        String schemeBenefit = extractLine(systemPrompt, "benefit:");
        String schemeSource = extractLine(systemPrompt, "sourceUrl:");
        String readyDocs = extractLine(systemPrompt, "- In-Hand Ready Documents");
        String missingDocs = extractLine(systemPrompt, "- Still Missing / Needed Documents");
        String eligibilityRules = extractSection(systemPrompt, "eligibilityRules:", "requiredDocuments:");
        String applicationSteps = extractSection(systemPrompt, "applicationSteps:", "\n\n");

        // ── 1. IN-HAND CITIZEN DOCUMENTS QUERIES ──────────────────────────────
        if (msg.contains("in hand") || msg.contains("have right now") || msg.contains("my document") ||
            (msg.contains("what") && msg.contains("documents") && msg.contains("i have")) ||
            (msg.contains("which") && msg.contains("documents") && msg.contains("i have")) ||
            msg.contains("कागदपत्रे आहेत") || msg.contains("माझ्याकडे") || msg.contains("दस्तावेज हैं") || msg.contains("मेरे पास")) {

            if (inHandDocs != null && !inHandDocs.isBlank() && !inHandDocs.contains("None declared")) {
                if (isMarathi) {
                    return "📋 **तुमच्याकडे सध्या खालील कागदपत्रे उपलब्ध आहेत:**\n\n" +
                           formatBulletList(inHandDocs) + "\n\n" +
                           "💡 **स्थिती:** ही कागदपत्रे तुमच्या प्रोफाइलमध्ये **AVAILABLE** म्हणून नोंदवली गेली आहेत. तुम्ही कोणत्याही योजनेसाठी उर्वरित कागदपत्रे विचारू शकता, उदा. *'EBC शिष्यवृत्तीसाठी मला अजून काय हवे?'*";
                } else if (isHindi) {
                    return "📋 **आपके पास वर्तमान में निम्नलिखित दस्तावेज उपलब्ध हैं:**\n\n" +
                           formatBulletList(inHandDocs) + "\n\n" +
                           "💡 **स्थिति:** ये दस्तावेज आपकी प्रोफाइल में **AVAILABLE** के रूप में चिह्नित हैं। किसी भी योजना के लिए शेष दस्तावेजों के बारे में पूछें।";
                } else {
                    return "📋 **You currently hold the following documents in hand:**\n\n" +
                           formatBulletList(inHandDocs) + "\n\n" +
                           "💡 **Readiness Status:** These declared paperwork items are marked as **AVAILABLE** in your profile and checklist. You can ask me about any specific scheme (e.g. *'What do I still need for EBC Scholarship?'*) to see your exact remaining paperwork.";
                }
            } else {
                if (isMarathi) {
                    return "⚠️ **तुमच्या प्रोफाइलमध्ये अद्याप कोणतीही कागदपत्रे जोडलेली नाहीत.**\n\nकृपया **प्रोफाइल विझार्ड (Step 4: Documents in Hand)** मध्ये जाऊन तुमच्याकडे असलेली कागदपत्रे निवडा (उदा. आधार कार्ड, उत्पन्नाचा दाखला, ७/१२ उतारा).";
                } else {
                    return "⚠️ **No in-hand documents declared yet.**\n\nPlease visit your **Citizen Profile Wizard (Step 4: Documents in Hand)** to select the certificates you currently hold. This enables JanSahay to calculate your instant application readiness!";
                }
            }
        }

        // ── 2. SCHEME-SPECIFIC DOCUMENT READINESS COMPARISON ───────────────────
        if (schemeName != null && (msg.contains("what do i need") || msg.contains("missing") || msg.contains("still need") || msg.contains("checklist") || msg.contains("कागदपत्रे लागतील") || msg.contains("कागदपत्रे काय"))) {
            StringBuilder sb = new StringBuilder();
            if (isMarathi) {
                sb.append("📑 **").append(schemeName).append(" साठी कागदपत्रांची सद्यस्थिती:**\n\n");
                if (readyDocs != null) sb.append("✅ **तुमच्या हातात तयार असलेली कागदपत्रे:**\n").append(readyDocs).append("\n\n");
                if (missingDocs != null) sb.append("⏳ **अजून आवश्यक असलेली कागदपत्रे (काढणे आवश्यक आहे):**\n").append(missingDocs).append("\n\n");
                sb.append("💡 **मार्गदर्शन:** अनुपलब्ध कागदपत्रांच्या कार्डवरील *'How to Generate Officially'* बटणावर क्लिक करून शासकीय पद्धतीनुसार ती त्वरित तयार करू शकता.");
            } else {
                sb.append("📑 **Document Readiness Breakdown for ").append(schemeName).append(":**\n\n");
                if (readyDocs != null) sb.append("✅ **Ready in Your Hand:**\n").append(readyDocs.replace("- In-Hand Ready Documents", "• In Hand")).append("\n\n");
                if (missingDocs != null) sb.append("⏳ **Still Needed / To Be Generated:**\n").append(missingDocs.replace("- Still Missing / Needed Documents", "• Action Needed")).append("\n\n");
                sb.append("💡 **Next Step:** Click the *'How to Generate Officially'* button on any missing document card in Section B to follow step-by-step state acquisition instructions.");
            }
            return sb.toString();
        }

        // ── 3. SPECIFIC CERTIFICATE GENERATION GUIDANCE ────────────────────────
        // 3.1 Income Certificate
        if (msg.contains("income certificate") || msg.contains("उत्पन्नाचा दाखला") || msg.contains("आय प्रमाण पत्र") || msg.contains("income dakhla")) {
            return "📄 **How to Obtain an Official Income Certificate (उत्पन्नाचा दाखला):**\n\n" +
                   "• **Issuing Authority:** Tehsildar / Sub-Divisional Officer (Revenue Department)\n" +
                   "• **Official Portal:** [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in) (or ServicePlus / CSC Setu Kendra)\n" +
                   "• **Statutory Fee & Timeline:** ₹33.00 • 15 to 21 working days\n" +
                   "• **Required Proofs:** Ration Card, Salary slip / Form 16 OR Talathi Income Enquiry Panchnama, Aadhaar Card, Electricity Bill\n\n" +
                   "**Step-by-Step Online Process:**\n" +
                   "1. Login to Aaple Sarkar portal using Aadhaar OTP.\n" +
                   "2. Select Revenue Department -> Certificates -> 'Income Certificate'.\n" +
                   "3. Fill family income details from all agricultural, salary, and business sources.\n" +
                   "4. Upload photo, Aadhaar, and Talathi income report.\n" +
                   "5. Pay ₹33 fee online and download digitally signed QR-code certificate upon Tehsildar approval.";
        }

        // 3.2 Domicile Certificate
        if (msg.contains("domicile") || msg.contains("अधिवास") || msg.contains("निवास प्रमाण पत्र") || msg.contains("nationality")) {
            return "📄 **How to Obtain an Official Domicile Certificate (अधिवास प्रमाणपत्र):**\n\n" +
                   "• **Issuing Authority:** Executive Magistrate / Tehsildar (Revenue Department)\n" +
                   "• **Official Portal:** [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in)\n" +
                   "• **Statutory Fee & Timeline:** ₹33.00 • 15 working days (Valid for Lifetime)\n" +
                   "• **Required Proofs:** School Leaving Certificate (LC) showing birthplace in state, 15 years continuous residential proof (ration card, light bill, property tax receipt), Aadhaar Card\n\n" +
                   "**Step-by-Step Online Process:**\n" +
                   "1. Login to Aaple Sarkar -> Revenue Services -> 'Age, Nationality & Domicile Certificate'.\n" +
                   "2. Provide residential address history proving continuous 15-year stay in Maharashtra.\n" +
                   "3. Upload School Leaving Certificate (LC) and residential proofs.\n" +
                   "4. Pay ₹33 online fee. Collect digitally signed barcode certificate from portal dashboard.";
        }

        // 3.3 7/12 & 8A Land Extract
        if (msg.contains("7/12") || msg.contains("satbara") || msg.contains("सातबारा") || msg.contains("८-अ") || msg.contains("8a") || msg.contains("land extract") || msg.contains("bhulekh")) {
            return "🌾 **How to Obtain Digital 7/12 & 8A Land Extracts (डिजिटल स्वाक्षरीत सातबारा व ८-अ):**\n\n" +
                   "• **Official Portal:** [https://digitalsatbara.mahabhumi.gov.in](https://digitalsatbara.mahabhumi.gov.in)\n" +
                   "• **Official Fee & Speed:** ₹15 per copy • Instant Download (24x7 Real-Time)\n" +
                   "• **Legal Validity:** Fully legally valid for all government schemes, bank crop loans, and court proceedings under Section 1-A of IT Act 2000.\n\n" +
                   "**Step-by-Step Download Process:**\n" +
                   "1. Open digitalsatbara.mahabhumi.gov.in and login with mobile number OTP.\n" +
                   "2. Click 'Recharge Wallet' and pay ₹15 via UPI/QR code.\n" +
                   "3. Select your District -> Taluka -> Village.\n" +
                   "4. Enter Gat Number or Survey Number and select Khatedar name.\n" +
                   "5. Click 'Download Digitally Signed 7/12' to get PDF with official digital signature and 16-digit ULPIN code.";
        }

        // 3.4 Caste Certificate & Validity
        if (msg.contains("caste validity") || msg.contains("जात पडताळणी") || msg.contains("barti") || msg.contains("scrutiny")) {
            return "📜 **How to Obtain a Caste Validity Certificate (जात पडताळणी प्रमाणपत्र):**\n\n" +
                   "• **Issuing Authority:** Divisional Caste Scrutiny Committee (Dr. Babasaheb Ambedkar Research & Training Institute - BARTI)\n" +
                   "• **Official Portal:** [https://barti.maharashtra.gov.in](https://barti.maharashtra.gov.in) (CCVIS System)\n" +
                   "• **Processing Timeline:** 45 to 90 working days\n" +
                   "• **Crucial Pre-Deem Records Needed:**\n" +
                   "  - SC: Ancestor revenue/school record prior to 10 August 1950\n" +
                   "  - VJNT/NT: Record prior to 21 November 1961\n" +
                   "  - OBC/SBC: Record prior to 13 October 1967\n\n" +
                   "**Step-by-Step Procedure:**\n" +
                   "1. Fill Form 16 (for higher education) on BARTI CCVIS portal.\n" +
                   "2. Upload ancestor primary school registers, father's LC, and family tree (Vanshavali).\n" +
                   "3. College Principal signs and forwards physical application file to District Committee.\n" +
                   "4. Attend hearing if summoned; download certificate once approved.";
        }

        // 3.5 Non-Creamy Layer (NCL)
        if (msg.contains("non creamy") || msg.contains("ncl") || msg.contains("नॉन क्रिमीलेअर") || msg.contains("creamy layer")) {
            return "📄 **How to Obtain a Non-Creamy Layer Certificate (NCL):**\n\n" +
                   "• **Eligibility:** Required for OBC, VJNT, SBC, and SEBC beneficiaries whose gross annual parental income is below ₹8 Lakhs.\n" +
                   "• **Authority & Portal:** Sub-Divisional Officer / Tehsildar via [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in)\n" +
                   "• **Fee & Validity:** ₹33 • Valid for 3 consecutive financial years\n" +
                   "• **Required Proofs:** 3 years income certificates or Form 16, original Caste Certificate, Ration card copy.";
        }

        // 3.6 Bank Account Aadhaar Seeding (NPCI / DBT)
        if (msg.contains("npci") || msg.contains("aadhaar seed") || msg.contains("dbt linkage") || msg.contains("आधार लिंक") || msg.contains("bank seed")) {
            return "🏦 **How to Seed Bank Account with Aadhaar (NPCI Mapping for DBT):**\n\n" +
                   "• **Why it's Mandatory:** Government DBT schemes (PM-KISAN, EBC scholarships, Ladki Bahin) disburse funds exclusively via Aadhaar Payment Bridge (APB). Normal bank account number transfers fail if NPCI is unlinked!\n" +
                   "• **Step-by-Step Seeding:**\n" +
                   "1. Download 'Aadhaar Seeding Mandate Consent Form' from your bank or collect at branch.\n" +
                   "2. Submit form with self-attested Aadhaar photocopy and bank passbook.\n" +
                   "3. Ask the branch officer specifically to link account on NPCI / PFMS mapper.\n" +
                   "4. Verify within 48 hours at [https://myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in) -> 'Bank Seeding Status'.";
        }

        // 3.7 Udyam MSME Registration
        if (msg.contains("udyam") || msg.contains("msme registration") || msg.contains("उद्यम नोंदणी")) {
            return "💼 **How to Obtain Official Udyam MSME Registration:**\n\n" +
                   "• **Official Portal:** [https://udyamregistration.gov.in](https://udyamregistration.gov.in) (100% Free Government Portal)\n" +
                   "• **Cost & Time:** ₹0 Free • Instant to 2 working days\n" +
                   "• **Prerequisites:** Aadhaar Card (mobile linked), PAN Card, Bank Account details\n" +
                   "• **Steps:**\n" +
                   "1. Visit udyamregistration.gov.in and select 'For New Entrepreneurs'.\n" +
                   "2. Enter Aadhaar number and OTP.\n" +
                   "3. Enter PAN card details and enterprise trade name.\n" +
                   "4. Select 4-digit NIC business activity code.\n" +
                   "5. Submit with final OTP. Download your official Udyam Certificate with QR code.";
        }

        // ── 4. FLAGSHIP SCHEMES DETAILED INQUIRIES ─────────────────────────────
        // 4.1 Majhi Ladki Bahin Yojana
        if (msg.contains("ladki bahin") || msg.contains("लाडकी बहीण") || msg.contains("ladki")) {
            return "🌸 **Mukhyamantri Majhi Ladki Bahin Yojana (Maharashtra):**\n\n" +
                   "• **Benefit:** ₹1,500 monthly direct financial assistance (₹18,000 annually) transferred directly to Aadhaar-seeded bank account.\n" +
                   "• **Eligibility:**\n" +
                   "  - Women aged 21 to 65 years\n" +
                   "  - Permanent resident of Maharashtra state\n" +
                   "  - Annual family income must not exceed ₹2.5 Lakh (or hold Yellow/Orange Ration Card)\n" +
                   "• **Documents Required:** Aadhaar Card, Domicile Certificate (or 15-yr Ration Card), Income Certificate (or Yellow/Orange Ration Card), Aadhaar-seeded Bank Passbook.\n" +
                   "• **Official Portal:** [https://ladakibahin.maharashtra.gov.in](https://ladakibahin.maharashtra.gov.in) or Nari Shakti Doot App.";
        }

        // 4.2 PM-KISAN & Namo Shetkari
        if (msg.contains("pm kisan") || msg.contains("pm-kisan") || msg.contains("namo shetkari") || msg.contains("पीएम किसान") || msg.contains("नमो शेतकरी") || (msg.contains("kisan") && msg.contains("installment"))) {
            return "🌾 **PM-KISAN & Namo Shetkari Mahasanman Nidhi:**\n\n" +
                   "• **Financial Grant:** ₹6,000/year (PM-KISAN Central) + ₹6,000/year (Namo Shetkari Maharashtra) = **₹12,000 Total per year** credited in ₹2,000 four-monthly installments.\n" +
                   "• **Eligibility:** All cultivable landholding farmer families with land in their name on 7/12 extract.\n" +
                   "• **3 Mandatory Conditions to Receive Installments:**\n" +
                   "  1. **e-KYC Completed:** Biometric or OTP verified on pmkisan.gov.in\n" +
                   "  2. **Land Seeding Active:** 7/12 land record mapped in state revenue portal\n" +
                   "  3. **Aadhaar Bank Seeding:** Bank account mapped on NPCI DBT gateway\n" +
                   "• **Official Portal:** [https://pmkisan.gov.in](https://pmkisan.gov.in) | Helpline: 155261 / 1800-115-526";
        }

        // 4.3 PM Mudra Yojana
        if (msg.contains("mudra") || msg.contains("मुद्रा") || msg.contains("business loan") || msg.contains("shishu") || msg.contains("tarun")) {
            return "💼 **Pradhan Mantri MUDRA Yojana (PMMY):**\n\n" +
                   "• **Overview:** Collateral-free micro-enterprise loans across all public, private, and rural banks.\n" +
                   "• **3 Loan Categories:**\n" +
                   "  - **Shishu:** Loans up to ₹50,000 (for new small business ideas, fruit/vegetable vending, repairs)\n" +
                   "  - **Kishor:** Loans from ₹50,001 to ₹5,00,000 (for expanding operations, machinery)\n" +
                   "  - **Tarun:** Loans from ₹5,00,001 to ₹10,00,000 (for established units)\n" +
                   "• **Key Features:** No collateral security required; repayment tenure 3 to 5 years; MUDRA RuPay Debit Card for working capital.\n" +
                   "• **Documents Required:** Aadhaar Card, PAN Card, Business Address Proof, Quotation of Machinery / Raw Materials, Bank Statement.\n" +
                   "• **Portal:** [https://www.mudra.org.in](https://www.mudra.org.in) / UdyamiMitra Portal.";
        }

        // 4.4 MahaDBT EBC Scholarship
        if (msg.contains("ebc") || msg.contains("rajarshi shahu") || msg.contains("shikshan shulkh") || msg.contains("ईबीसी")) {
            return "🎓 **Rajarshi Chhatrapati Shahu Maharaj EBC Scholarship (Maharashtra):**\n\n" +
                   "• **Benefit:** 50% Tuition Fee & Exam Fee reimbursement for Open / General category students in approved professional, engineering, medical, and polytechnic colleges.\n" +
                   "• **Eligibility Criteria:**\n" +
                   "  - Enrolled through Centralized Admission Process (CAP)\n" +
                   "  - Family annual income below ₹8,00,000 per annum\n" +
                   "  - Maharashtra domicile\n" +
                   "  - Maximum 2 beneficiaries from the same family\n" +
                   "• **Required Documents:** Income Certificate from Tehsildar, Domicile Certificate, CAP Allotment Letter, College Bonafide & Current Year Fee Receipt, 10th & 12th Marksheet.\n" +
                   "• **Official Portal:** [https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in)";
        }

        // 4.5 AICTE Pragati Scholarship for Girls
        if (msg.contains("pragati") || msg.contains("aicte") || msg.contains("girl scholarship") || msg.contains("प्रगती")) {
            return "🎓 **AICTE Pragati Scholarship for Girls (Technical Degree):**\n\n" +
                   "• **Benefit:** ₹50,000 per year towards tuition fees, laptop, books, and educational equipment.\n" +
                   "• **Eligibility:** Female students admitted to 1st year of technical degree/diploma program via CAP; family income below ₹8 Lakh/year; maximum 2 girls per family.\n" +
                   "• **Official Portal:** [https://scholarships.gov.in](https://scholarships.gov.in) (National Scholarship Portal - NSP).";
        }

        // 4.6 Ayushman Bharat PM-JAY & MJPJAY
        if (msg.contains("ayushman") || msg.contains("pm-jay") || msg.contains("pmjay") || msg.contains("mjpjay") || msg.contains("health card") || msg.contains("आयुष्मान")) {
            return "🏥 **Ayushman Bharat PM-JAY & MJPJAY Health Assurance:**\n\n" +
                   "• **Coverage:** Up to **₹5,00,000 cashless secondary and tertiary hospital treatment** per family per year across 28,000+ empaneled government and private hospitals in India.\n" +
                   "• **Treatments Covered:** 1,949 medical procedures including heart surgery, knee replacements, cancer chemotherapy, neurosurgery, and kidney dialysis.\n" +
                   "• **How to Make Ayushman Card:** Visit nearest government civil hospital, CSC Setu center, or download Ayushman App. Verify with Aadhaar OTP.\n" +
                   "• **Official Portal:** [https://beneficiary.nha.gov.in](https://beneficiary.nha.gov.in) | National Toll-Free: 14555";
        }

        // 4.7 PM Vishwakarma
        if (msg.contains("vishwakarma") || msg.contains("artisan") || msg.contains("विश्वकर्मा")) {
            return "🛠️ **PM Vishwakarma Scheme (For Artisans & Craftsmen):**\n\n" +
                   "• **Benefits:**\n" +
                   "  - Collateral-free enterprise loan up to ₹3,00,000 at 5% concessional interest (Tranche 1: ₹1 Lakh, Tranche 2: ₹2 Lakh)\n" +
                   "  - ₹15,000 e-voucher for modern toolkits\n" +
                   "  - Free skill training with ₹500 daily stipend\n" +
                   "• **Trades Covered:** 18 traditional crafts including Carpenters (Suthar), Blacksmiths (Lohar), Potters (Kumhaar), Masons (Rajmistri), Cobblers, Tailors (Darzi).\n" +
                   "• **Official Portal:** [https://pmvishwakarma.gov.in](https://pmvishwakarma.gov.in)";
        }

        // 4.8 Pradhan Mantri Awas Yojana (PMAY)
        if (msg.contains("awas") || msg.contains("pmay") || msg.contains("gharkul") || msg.contains("घरकुल") || msg.contains("आवास")) {
            return "🏠 **Pradhan Mantri Awas Yojana (PMAY-Gramin & Urban / Gharkul):**\n\n" +
                   "• **PMAY-G (Rural):** Direct financial assistance of ₹1,20,000 (Plains) or ₹1,30,000 (Hilly regions) + ₹24,000 MGNREGA labor wages + ₹12,000 toilet subsidy.\n" +
                   "• **Maharashtra State Schemes:** Ramai Gharkul (SC/Neo-Buddhist), Shabari Gharkul (ST), and Modi Awas Gharkul (OBC) provide equivalent pucca house subsidies.\n" +
                   "• **Official Portal:** [https://pmayg.nic.in](https://pmayg.nic.in) / State Rural Housing.";
        }

        // ── 5. OFFICIAL HELPLINE DIRECTORY ─────────────────────────────────────
        if (msg.contains("helpline") || msg.contains("contact") || msg.contains("toll free") || msg.contains("number") || msg.contains("हेल्पलाइन") || msg.contains("संपर्क") || msg.contains("कॉल")) {
            return "📞 **Official Government Welfare Helpline Directory:**\n\n" +
                   "• **PM-KISAN Central Helpline:** 155261 / 1800-115-526 / 011-24300606\n" +
                   "• **MahaDBT Scholarship Helpline (Maharashtra):** 022-49150800\n" +
                   "• **Ayushman Bharat PM-JAY National Toll-Free:** 14555 / 1800-111-565\n" +
                   "• **National Scholarship Portal (NSP):** 0120-6619540\n" +
                   "• **Kisan Call Center (Agriculture Guidance):** 1800-180-1551\n" +
                   "• **Mudra Loan / MSME Bank Mitra:** 1800-180-1111 / 1800-11-0001\n" +
                   "• **UIDAI Aadhaar Support:** 1947\n" +
                   "• **Aaple Sarkar Citizen Services (Maharashtra):** 1800-120-8040\n" +
                   "• **National Cyber Crime Helpline:** 1930";
        }

        // ── 6. APPLICATION STEPS / HOW TO APPLY ────────────────────────────────
        if (msg.contains("how to apply") || msg.contains("apply") || msg.contains("application") || msg.contains("steps") || msg.contains("process") || msg.contains("अर्ज") || msg.contains("आवेदन")) {
            if (schemeName != null) {
                String portalLink = schemeSource != null ? "[" + schemeSource + "](" + schemeSource + ")" : "the official government portal";
                if (isMarathi) {
                    return "📝 **" + schemeName + " साठी अर्ज करण्याची अधिकृत पद्धत:**\n\n" +
                           (applicationSteps != null && !applicationSteps.isBlank() ? applicationSteps.trim() : "1. आवश्यक कागदपत्रे गोळा करा.\n2. अधिकृत शासकीय पोर्टलवर नोंदणी करा.\n3. अर्ज सबमिट करून पोचपावती जतन करा.") + "\n\n" +
                           "🌐 **थेट अर्ज करण्यासाठी अधिकृत पोर्टल:** " + portalLink + "\n\n" +
                           "⚠️ **टीप:** कोणत्याही दलालाला पैसे देऊ नका. जनसहायवरील सर्व योजना माहिती व थेट पोर्टल लिंक्स पूर्णपणे विनामूल्य आहेत.";
                } else {
                    return "📝 **How to Officially Apply for " + schemeName + ":**\n\n" +
                           (applicationSteps != null && !applicationSteps.isBlank() ? applicationSteps.trim() : "1. Gather your in-hand paperwork.\n2. Open the verified government portal.\n3. Complete registration and upload certified documents.\n4. Submit and record acknowledgment number.") + "\n\n" +
                           "🌐 **Verified Government Application Gateway:** " + portalLink + "\n\n" +
                           "💡 **Direct Access:** Click the prominent green button *'Apply Officially on Govt Portal'* at the top or bottom of this page to render directly on the official application site!";
                }
            }
        }

        // ── 7. ELIGIBILITY QUERIES ─────────────────────────────────────────────
        if (msg.contains("eligible") || msg.contains("qualify") || msg.contains("criteria") || msg.contains("पात्र") || msg.contains("पात्रता") || msg.contains("योग्यता")) {
            if (schemeName != null) {
                return "🎯 **Eligibility Conditions for " + schemeName + ":**\n\n" +
                       (eligibilityRules != null && !eligibilityRules.isBlank() ? eligibilityRules.trim() : "Standard category, residence, and income criteria apply.") + "\n\n" +
                       (schemeBenefit != null ? "🎁 **Entitled Benefit:** " + schemeBenefit + "\n\n" : "") +
                       "💡 JanSahay's rule engine evaluates your profile conditions deterministically. Final verification is conducted by the sanctioning government officer.";
            } else {
                return "Scheme eligibility depends on your Beneficiary Category (Student, Farmer, Business Owner, General Citizen), State Domicile, and Family Annual Income.\n\nComplete your **Citizen Profile** to see your personalized recommendations with full mathematical rule matching!";
            }
        }

        // ── 8. FALLBACK & GENERAL OVERVIEW ─────────────────────────────────────
        if (schemeName != null) {
            return "ℹ️ **" + schemeName + " Overview:**\n\n" +
                   (schemeDesc != null ? schemeDesc + "\n\n" : "") +
                   "🎁 **Direct Benefit:** " + (schemeBenefit != null ? schemeBenefit : "Financial and welfare support as per guidelines") + "\n\n" +
                   (schemeSource != null ? "🌐 **Official Portal Link:** [" + schemeSource + "](" + schemeSource + ")\n\n" : "") +
                   "Ask me about required documents, how to generate missing certificates, eligibility rules, or how to apply!";
        }

        if (isMarathi) {
            return "🙏 **जनसहाय AI सहाय्यकामध्ये आपले स्वागत आहे!**\n\n" +
                   "मी केंद्र आणि राज्य शासनाच्या 40+ योजना, कागदपत्रांची पूर्तता आणि अर्ज प्रक्रियेबद्दल मार्गदर्शन करतो.\n\n" +
                   "तुम्ही मला विचारू शकता:\n" +
                   "• *'माझ्याकडे कोणती कागदपत्रे उपलब्ध आहेत?'*\n" +
                   "• *'उत्पन्नाचा दाखला कसा काढायचा?'*\n" +
                   "• *'७/१२ उतारा कसा डाउनलोड करावा?'*\n" +
                   "• *'लाडकी बहीण योजनेची पात्रता काय आहे?'*\n" +
                   "• *'पीएम किसान योजनेचे पैसे कधी जमा होतात?'*";
        } else if (isHindi) {
            return "🙏 **जनसहाय AI सहायक में आपका स्वागत है!**\n\n" +
                   "मैं सरकारी योजनाओं, आवश्यक दस्तावेजों और आवेदन प्रक्रियाओं के बारे में सटीक मार्गदर्शन प्रदान करता हूँ।\n\n" +
                   "आप पूछ सकते हैं:\n" +
                   "• *'मेरे पास कौन से दस्तावेज हैं?'*\n" +
                   "• *'आय प्रमाण पत्र कैसे बनवाएं?'*\n" +
                   "• *'पीएम किसान योजना के लिए पात्रता क्या है?'*\n" +
                   "• *'मुद्रा लोन के प्रकार क्या हैं?'*";
        } else {
            return "👋 **Welcome to JanSahay AI Assistant!**\n\n" +
                   "I provide verified assistance for **40+ Central & State government welfare schemes**, document readiness, and certificate acquisition procedures.\n\n" +
                   "You can ask me:\n" +
                   "• *'Which documents do I currently have in hand?'*\n" +
                   "• *'How do I obtain an Income Certificate or Domicile in Maharashtra?'*\n" +
                   "• *'How to download digital 7/12 land extract?'*\n" +
                   "• *'What are the 3 loan categories under PM Mudra?'*\n" +
                   "• *'What are the official government helpline numbers?'*";
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
               lower.contains("लागतील") || lower.contains("कसा") || lower.contains("कशी") ||
               lower.contains("ahet") || lower.contains("ahe") || lower.contains("sheti") || lower.contains("kiti");
    }

    private boolean isHindiLanguage(String text) {
        if (text == null) return false;
        String lower = text.toLowerCase();
        return lower.contains("hindi") || lower.contains("हिंदी") || lower.contains("दस्तावेज") ||
               lower.contains("आवेदन") || lower.contains("बताइए") || lower.contains("किसान") ||
               lower.contains("छात्रवृत्ति") || lower.contains("चाहिए") || lower.contains("योजना") ||
               lower.contains("है") || lower.contains("हैं") || lower.contains("कैसे");
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
