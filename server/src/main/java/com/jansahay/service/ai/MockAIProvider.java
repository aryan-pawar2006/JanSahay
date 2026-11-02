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

        // ══════════════════════════════════════════════════════════════════════════
        // 1. IN-HAND CITIZEN DOCUMENTS QUERIES
        // ══════════════════════════════════════════════════════════════════════════
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

        // ══════════════════════════════════════════════════════════════════════════
        // 2. SCHEME-SPECIFIC DOCUMENT READINESS COMPARISON
        // ══════════════════════════════════════════════════════════════════════════
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

        // ══════════════════════════════════════════════════════════════════════════
        // 3. AADHAAR CARD PROBLEMS (SMALL & BIG)
        // ══════════════════════════════════════════════════════════════════════════
        // 3.1 Aadhaar OTP not coming / Mobile linking
        if (msg.contains("otp") || msg.contains("mobile not linked") || msg.contains("aadhaar otp") || msg.contains("ओटीपी") || msg.contains("मोबाईल लिंक")) {
            return "📱 **Problem: Aadhaar OTP Not Received / Mobile Number Not Linked:**\n\n" +
                   "• **Reason:** Aadhaar OTP is sent ONLY to the mobile number officially registered with UIDAI. If your number has changed or was never linked, online OTP-based services will fail.\n\n" +
                   "**Systematic Solution (2 Simple Steps):**\n" +
                   "1. **Check Which Number is Registered:** Visit [https://myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in) -> Click **'Verify Mobile Number'** to check if your active SIM is mapped.\n" +
                   "2. **To Link/Update Mobile Number (No Documents Required):**\n" +
                   "   - Walk into any nearby Post Office Aadhaar Seva Kendra or Bank Branch.\n" +
                   "   - No paperwork or proof is required for mobile updating—only biometric fingerprint verification.\n" +
                   "   - Statutory Government Fee: ₹50 only.\n" +
                   "   - The new mobile number gets activated in UIDAI records within 24 to 48 hours.";
        }

        // 3.2 Aadhaar Name/DOB Spelling Mismatch with Marksheet or 7/12
        if ((msg.contains("name") && (msg.contains("mismatch") || msg.contains("spelling") || msg.contains("different"))) ||
            msg.contains("नाव फरक") || msg.contains("नावात चूक") || msg.contains("spelling mistake") || msg.contains("dob mismatch")) {
            return "📝 **Problem: Name or Date of Birth Mismatch in Aadhaar vs Marksheet / 7/12:**\n\n" +
                   "• **Why it Matters:** Government portals (MahaDBT, PM-KISAN, Ladki Bahin) perform automatic API string matching. A difference in surname order or single spelling letter will reject your scrutiny.\n\n" +
                   "**Systematic Solution:**\n" +
                   "1. **Decide Which Record is Master:** For students, 10th Board Certificate / School LC is considered statutory proof. For farmers, 7/12 revenue record is primary.\n" +
                   "2. **Update Aadhaar Online (if name change < 2 times):**\n" +
                   "   - Open [https://myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in) -> Login with OTP.\n" +
                   "   - Click **'Address / Identity Update'** -> Upload color scan of School LC or PAN Card.\n" +
                   "   - Standard fee: ₹50. Verification takes 3 to 7 working days.\n" +
                   "3. **Temporary Emergency Remedy for Schemes:** If application deadline is near, get a **Self-Declaration Gazette / Notarized Affidavit on ₹100 stamp paper** stating: *'Both names (Name A and Name B) refer to the same individual'*. Government officers accept this for provisional scrutiny.";
        }

        // 3.3 Biometric Authentication Failure / Lock
        if (msg.contains("biometric") || msg.contains("fingerprint") || msg.contains("बायोमेट्रिक") || msg.contains("अंगठा येत नाही")) {
            return "🔐 **Problem: Biometric / Fingerprint Authentication Failed at CSC Kendra:**\n\n" +
                   "• **Causes:** 1) Biometric Lock enabled in mAadhaar app; 2) Worn ridge fingerprints (common in elderly citizens and agricultural workers); 3) Dirty scanner.\n\n" +
                   "**Systematic Solution:**\n" +
                   "1. **Check mAadhaar App Lock:** Open the official mAadhaar App on your smartphone. Ensure **'Biometric Lock'** toggle is OFF before placing fingerprint at the center.\n" +
                   "2. **Alternative Authentication (IRIS Scanner):** Ask the CSC / Setu center operator to use an **Eye IRIS Scanner** instead of the fingerprint reader.\n" +
                   "3. **Biometric Update at Aadhaar Kendra:** If ridges are worn out, visit Aadhaar Seva Kendra for **Biometric Update (₹100 fee)** to refresh fingerprints and facial scan.";
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 4. BANK & DBT / NPCI SEEDING PROBLEMS (SMALL & BIG)
        // ══════════════════════════════════════════════════════════════════════════
        // 4.1 NPCI Aadhaar Seeding vs Regular Bank Linking
        if (msg.contains("npci") || msg.contains("aadhaar seed") || msg.contains("dbt linkage") || msg.contains("आधार लिंक") || msg.contains("bank seed") || msg.contains("dbt not received")) {
            return "🏦 **How to Seed Bank Account with Aadhaar (NPCI Mapping for DBT):**\n\n" +
                   "⚠️ **Crucial Difference:** Giving your Aadhaar to the bank for KYC is NOT the same as NPCI DBT Seeding!\n" +
                   "• KYC only unlocks your account.\n" +
                   "• **NPCI Seeding** tells the Government of India *which* bank account must receive direct DBT subsidies.\n\n" +
                   "**How to Fix in 3 Simple Steps:**\n" +
                   "1. **Download Mandate Form:** Get the 'Aadhaar Seeding with NPCI Mapper Consent Form' from your bank branch.\n" +
                   "2. **Submit at Branch:** Submit the form with an Aadhaar photocopy and write clearly: *'Map this account for Direct Benefit Transfer (DBT) on NPCI Mapper'*. Request a stamped acknowledgment receipt.\n" +
                   "3. **Track Live Seeding Status Online:**\n" +
                   "   - Go to [https://myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in) -> Click **'Bank Seeding Status'**.\n" +
                   "   - Enter Aadhaar + OTP. It will display the bank name and date of mapping. (Takes 48 hours to reflect).";
        }

        // 4.2 Money Not Received / DBT Payment Failed
        if ((msg.contains("payment") || msg.contains("money") || msg.contains("installment") || msg.contains("पैसे आले नाहीत") || msg.contains("पैसे जमा झाले नाहीत")) &&
            (msg.contains("not received") || msg.contains("failed") || msg.contains("pending") || msg.contains("का आले नाहीत"))) {
            return "💳 **Problem: Scheme Money / Installment Approved but Not Received in Account:**\n\n" +
                   "**Check these 3 common failure reasons:**\n" +
                   "1. **Dormant / Inactive Bank Account:** If no transaction was made in the last 12 months, the bank freezes DBT credits. Deposit ₹100 at the branch counter to make it active.\n" +
                   "2. **Aadhaar Mapped to an Old Forgotten Account:** Many citizens have an old Jan Dhan, Post Office, or childhood account where the DBT was silently credited. Check your status at `myaadhaar.uidai.gov.in`.\n" +
                   "3. **PFMS / NPCI Rejection:** Check your application status on the scheme portal. If it says *'PFMS Rejected: Invalid Account'*, visit the branch and request immediate NPCI re-seeding.";
        }

        // 4.3 PM Jan Dhan Account (Zero Balance)
        if (msg.contains("jan dhan") || msg.contains("जन धन") || msg.contains("zero balance")) {
            return "🏦 **Pradhan Mantri Jan Dhan Yojana (PMJDY) - Zero Balance Account:**\n\n" +
                   "• **Benefits:** No minimum balance required; Free RuPay debit card; ₹2,00,000 accidental insurance coverage; Overdraft facility up to ₹10,000.\n" +
                   "• **Documents Needed:** Just your Aadhaar Card and 2 passport photos (no income certificate required).\n" +
                   "• **Where to Open:** Any Public Sector Bank (SBI, Bank of Baroda, Bank of Maharashtra), Regional Rural Bank, or India Post Payments Bank (IPPB).\n" +
                   "• **Ideal For:** Students and Ladki Bahin beneficiaries needing a clean, dedicated DBT-receiving account.";
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 5. GOVERNMENT CERTIFICATES & REJECTION REMEDIES (SMALL & BIG)
        // ══════════════════════════════════════════════════════════════════════════
        // 5.1 Why was Income Certificate Rejected & How to Appeal
        if ((msg.contains("income") && (msg.contains("reject") || msg.contains("रद्द") || msg.contains("नाकारला") || msg.contains("objection"))) ||
            msg.contains("दाखला का नाकारला")) {
            return "⚠️ **Why Was Your Income Certificate Application Rejected by Tehsildar?**\n\n" +
                   "**Top 3 Reasons for Rejection:**\n" +
                   "1. **Missing Talathi Panchnama:** In rural areas, applications without the Talathi verification report on land and agricultural crop income are rejected.\n" +
                   "2. **Blurry Document Uploads:** Uploading unreadable mobile photos of ration cards or salary certificates.\n" +
                   "3. **Incomplete Family Income:** Showing zero income while owning multiple hectares of irrigated land on 7/12.\n\n" +
                   "**Systematic Remedy:**\n" +
                   "• Open Aaple Sarkar -> Click **'Application History'** -> Check the specific **'Rejection Scrutiny Remark'**.\n" +
                   "• Click **'Rectify & Resubmit'** within 15 days; re-upload the requested Talathi report or salary slip without paying the fee again!\n" +
                   "• If unjustly rejected, file a **1st Appeal online under Right to Public Services Act (RTS 2015)** to the Sub-Divisional Officer (SDO) with 0 fees.";
        }

        // 5.2 Income Certificate Procedure
        if (msg.contains("income certificate") || msg.contains("उत्पन्नाचा दाखला") || msg.contains("आय प्रमाण पत्र") || msg.contains("income dakhla")) {
            return "📄 **How to Obtain an Official Income Certificate (उत्पन्नाचा दाखला):**\n\n" +
                   "• **Issuing Authority:** Tehsildar / Sub-Divisional Officer (Revenue Department)\n" +
                   "• **Official Portal:** [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in) (or ServicePlus / CSC Setu Kendra)\n" +
                   "• **Statutory Fee & Timeline:** ₹33.00 statutory RTS fee • 15 working days\n" +
                   "• **Required Proofs:** Ration Card, Salary slip / Form 16 OR Talathi Income Enquiry Panchnama, Aadhaar Card, Electricity Bill\n\n" +
                   "**Step-by-Step Online Process:**\n" +
                   "1. Login to Aaple Sarkar portal using Aadhaar OTP.\n" +
                   "2. Select Revenue Department -> Certificates -> 'Income Certificate'.\n" +
                   "3. Fill family income details from all agricultural, salary, and business sources.\n" +
                   "4. Upload photo, Aadhaar, and Talathi income report.\n" +
                   "5. Pay ₹33 fee online and download digitally signed QR-code certificate upon Tehsildar approval.";
        }

        // 5.3 Domicile Certificate
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

        // 5.4 Digital 7/12 & 8A Land Extract & Ferfar
        if (msg.contains("7/12") || msg.contains("satbara") || msg.contains("सातबारा") || msg.contains("८-अ") || msg.contains("8a") || msg.contains("land extract") || msg.contains("ferfar") || msg.contains("फेरफार")) {
            return "🌾 **How to Obtain Digital 7/12 & 8A Land Extracts (डिजिटल स्वाक्षरीत सातबारा व ८-अ):**\n\n" +
                   "• **Official Portal:** [https://digitalsatbara.mahabhumi.gov.in](https://digitalsatbara.mahabhumi.gov.in)\n" +
                   "• **Official Fee & Speed:** ₹15 per copy • Instant Download (24x7 Real-Time)\n" +
                   "• **Legal Validity:** Fully legally valid for all government schemes, bank crop loans, and court proceedings under Section 1-A of IT Act 2000.\n\n" +
                   "**Step-by-Step Download Process:**\n" +
                   "1. Open digitalsatbara.mahabhumi.gov.in and login with mobile number OTP.\n" +
                   "2. Click 'Recharge Wallet' and pay ₹15 via UPI/QR code.\n" +
                   "3. Select your District -> Taluka -> Village.\n" +
                   "4. Enter Gat Number or Survey Number and select Khatedar name.\n" +
                   "5. Click 'Download Digitally Signed 7/12' to get PDF with official digital signature and 16-digit ULPIN code.\n\n" +
                   "**Need Name Correction / Ferfar (Mutation)?** Apply online via E-Hakk portal ([https://pDS.mahabhumi.gov.in](https://pds.mahabhumi.gov.in)) for inheritance (Varas Nond) without visiting Talathi office.";
        }

        // 5.5 Caste Certificate & Caste Validity (BARTI)
        if (msg.contains("caste validity") || msg.contains("जात पडताळणी") || msg.contains("barti") || msg.contains("scrutiny committee") || msg.contains("caste certificate")) {
            return "📜 **How to Obtain Caste Certificate & Caste Validity (जात पडताळणी प्रमाणपत्र):**\n\n" +
                   "• **Caste Certificate:** Issued by Sub-Divisional Officer (SDO) via Aaple Sarkar portal in 21 days.\n" +
                   "• **Caste Validity Certificate:** Issued by Divisional Caste Scrutiny Committee (BARTI / Social Justice Dept).\n" +
                   "• **Official Validity Portal:** [https://barti.maharashtra.gov.in](https://barti.maharashtra.gov.in) (CCVIS System)\n" +
                   "• **Crucial Pre-Deem Base Year Records Required:**\n" +
                   "  - SC: Ancestor revenue/school record prior to **10 August 1950**\n" +
                   "  - VJNT / NT: Record prior to **21 November 1961**\n" +
                   "  - OBC / SBC: Record prior to **13 October 1967**\n\n" +
                   "**Step-by-Step Application:**\n" +
                   "1. Fill Form 16 (for higher education) on BARTI CCVIS portal.\n" +
                   "2. Upload ancestor primary school admission registers, father's/grandfather's School LC, and family tree affidavit (Vanshavali).\n" +
                   "3. College Principal signs and forwards physical application file to District Committee.\n" +
                   "4. Track scrutiny online; download barcode-verified certificate once approved.";
        }

        // 5.6 Non-Creamy Layer (NCL)
        if (msg.contains("non creamy") || msg.contains("ncl") || msg.contains("नॉन क्रिमीलेअर") || msg.contains("creamy layer")) {
            return "📄 **How to Obtain a Non-Creamy Layer Certificate (NCL):**\n\n" +
                   "• **Eligibility:** Required for OBC, VJNT, SBC, and SEBC beneficiaries whose gross annual parental income is below ₹8 Lakhs for 3 consecutive financial years.\n" +
                   "• **Authority & Portal:** Sub-Divisional Officer / Tehsildar via [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in)\n" +
                   "• **Fee & Validity:** ₹33 • Valid for 3 consecutive financial years\n" +
                   "• **Required Proofs:** 3 years income certificates or Form 16, original Caste Certificate, Ration card copy, Self-declaration affidavit.\n" +
                   "💡 **Tip:** Income from agriculture is excluded when computing the ₹8 Lakh ceiling as per DoPT guidelines!";
        }

        // 5.7 EWS Certificate (Economically Weaker Section)
        if (msg.contains("ews") || msg.contains("ईडब्ल्यूएस") || msg.contains("economically weaker")) {
            return "🏛️ **How to Obtain EWS Certificate (10% Reservation in Jobs & Admissions):**\n\n" +
                   "• **Eligibility:** Open/General category citizens not covered under SC/ST/OBC reservation.\n" +
                   "• **Criteria:** Gross annual family income below ₹8,00,000 from all sources.\n" +
                   "• **Issuing Authority:** Tehsildar / SDO via Aaple Sarkar portal ([https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in)).\n" +
                   "• **Documents:** 3 years ITR or Tehsildar income certificate, Domicile certificate, 10th LC, Property declaration.\n" +
                   "• **Validity:** 1 Financial Year (Valid from 1st April to 31st March).";
        }

        // 5.8 Disability Certificate & UDID Card
        if (msg.contains("disability") || msg.contains("udid") || msg.contains("दिव्यांग") || msg.contains("अपंग") || msg.contains("handicap")) {
            return "♿ **How to Obtain Unique Disability ID (UDID) Card & Certificate:**\n\n" +
                   "• **Official Portal:** [https://www.swavlambancard.gov.in](https://www.swavlambancard.gov.in) (Department of Empowerment of Persons with Disabilities)\n" +
                   "• **Cost:** 100% Free Government Service\n" +
                   "• **Process:**\n" +
                   "  1. Register online on Swavlamban portal with Aadhaar card and disability photos.\n" +
                   "  2. Book an assessment appointment at your District Civil Hospital (CMO Medical Board).\n" +
                   "  3. Appear before the medical specialist for disability percentage calculation (min 40% required for government scheme reservations).\n" +
                   "  4. Download digitally signed e-UDID card with nationwide validity.";
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 6. STUDENT & EDUCATION SCHOLARSHIP PROBLEMS (SMALL & BIG)
        // ══════════════════════════════════════════════════════════════════════════
        // 6.1 MahaDBT Scrutiny Remark / Application Sent Back
        if (msg.contains("scrutiny remark") || msg.contains("sent back") || msg.contains("re-apply") || msg.contains("mahadbt reject") || msg.contains("अर्ज परत आला")) {
            return "🎓 **Problem: MahaDBT Application Sent Back with Scrutiny Remark:**\n\n" +
                   "• **What it Means:** Don't worry! Your application is NOT permanently rejected. The College Clerk or Department Officer noticed an incomplete document or unclear photo.\n\n" +
                   "**How to Fix in 3 Steps:**\n" +
                   "1. Login to [https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in) -> Go to **'My Applied Scheme'** -> Click **'Scrutiny Status'**.\n" +
                   "2. Read the exact remark (e.g., *'Upload current academic year fee receipt'* or *'Income certificate not digitally signed'*).\n" +
                   "3. Click **'Update / Re-Submit'** -> Replace only the flagged document -> Click Submit. Your original seniority and application number are preserved!";
        }

        // 6.2 College Not Found in MahaDBT Dropdown
        if ((msg.contains("college") || msg.contains("institute")) && (msg.contains("not found") || msg.contains("not showing") || msg.contains("dropdown") || msg.contains("सापडत नाही"))) {
            return "🏫 **Problem: College / Course Not Showing in MahaDBT Dropdown:**\n\n" +
                   "• **Cause:** Every year colleges must complete mandatory KYC on the MahaDBT portal and link their AISHE (All India Survey on Higher Education) code.\n\n" +
                   "**Systematic Solution:**\n" +
                   "1. Visit your college administrative office / scholarship section clerk.\n" +
                   "2. Inform them: *'The college/course is not updated in the MahaDBT master database for this academic year'*. College nodal officer must submit an online approval ticket on the DTE/Social Welfare dashboard.\n" +
                   "3. Once the college completes profile updation, the college name appears instantly in your dropdown list.";
        }

        // 6.3 Dual Scholarships (Can I apply for both State and Central?)
        if ((msg.contains("two scholarship") || msg.contains("both scholarship") || msg.contains("dual") || msg.contains("दोन शिष्यवृत्ती")) ||
            (msg.contains("nsp") && msg.contains("mahadbt"))) {
            return "🎓 **Rule: Can You Apply for Both Central (NSP) and State (MahaDBT) Scholarships?**\n\n" +
                   "• **Statutory Government Rule:** A student **CANNOT** claim Tuition Fee Reimbursement from two different government sources for the same academic year.\n" +
                   "• **Permitted Exception:** You **CAN** take a Tuition Fee Waiver from the State Government (e.g. MahaDBT EBC 50% waiver) AND simultaneously receive a **Merit / Maintenance allowance** from a Central scheme or private foundation (e.g. AICTE Pragati, Tata Trust, or Central Sector Scheme) as long as it covers living expenses.\n" +
                   "• **Warning:** Double fee claims trigger automated PFMS deduplication and can result in cancellation and recovery notice.";
        }

        // 6.4 Management Quota / Gap Certificate
        if (msg.contains("management quota") || msg.contains("gap certificate") || msg.contains("गॅप") || msg.contains("शिक्षण खंड")) {
            return "📋 **Student Rules: Management Quota & Education Gap Certificate:**\n\n" +
                   "• **Management / Institute Quota:** Government fee concessions (EBC, Freeship) are **NOT** applicable to students admitted through private management quota. Only admissions through **Centralized Admission Process (CAP)** by State CET Cell qualify.\n" +
                   "• **Gap Certificate (गॅप प्रमाणपत्र):** If you took a 1-year or 2-year break between 12th/diploma and degree:\n" +
                   "  - Make an affidavit on ₹100 stamp paper stating the legitimate reason for the break (e.g. medical illness, competitive exam preparation, financial difficulty).\n" +
                   "  - Have it notarized by an Executive Magistrate or Notary Advocate. It is 100% accepted by MahaDBT and colleges.";
        }

        // 6.5 MahaDBT EBC Scholarship Overview
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

        // 6.6 Hostel Maintenance: Dr. Punjabrao Deshmukh vs Swadhar
        if (msg.contains("hostel") || msg.contains("punjabrao deshmukh") || msg.contains("स्वाधार") || msg.contains("swadhar") || msg.contains("वसतिगृह")) {
            return "🏢 **Hostel Maintenance Allowance Schemes for Students:**\n\n" +
                   "1. **Dr. Panjabrao Deshmukh Hostel Maintenance Allowance (Open/EBC/SEBC):**\n" +
                   "   - For children of registered marginal farmers and registered construction workers: ₹30,000/year (for MMRDA/Pune metro areas) or ₹20,000/year (other cities).\n" +
                   "   - For general EBC students (income < ₹8L): ₹10,000 (metro) or ₹8,000 (other cities).\n" +
                   "   - Requires: Registered rent agreement or hostel warden fee receipt.\n\n" +
                   "2. **Bharatratna Dr. Babasaheb Ambedkar Swadhar Yojana (SC/Navboudha):**\n" +
                   "   - Up to ₹60,000/year directly credited for food, lodging, and books for SC students unable to secure government hostel seats.";
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 7. FARMER & AGRICULTURE PROBLEMS (SMALL & BIG)
        // ══════════════════════════════════════════════════════════════════════════
        // 7.1 PM-KISAN Land Seeding 'NO' Error
        if (msg.contains("land seeding") || msg.contains("लँड सीडिंग") || msg.contains("land seeding no")) {
            return "🌾 **Problem: 'Land Seeding: NO' Error in PM-KISAN Status:**\n\n" +
                   "• **Why it Happened:** Your land ownership record on 7/12 extract is not linked to your PM-KISAN registration ID in the state revenue database.\n\n" +
                   "**Systematic Solution (3 Steps):**\n" +
                   "1. Take a printout of your **PM-KISAN Beneficiary Status** page showing 'Land Seeding: NO'.\n" +
                   "2. Attach a fresh **Digital 7/12 Extract**, **8-A Khata Extract**, and self-attested Aadhaar photocopy.\n" +
                   "3. Hand over the documents to your **Village Talathi (Patwari)** or visit the **Tehsildar Office (Agriculture / PM-KISAN Nodal Desk)**.\n" +
                   "4. The Talathi approves land verification on the state portal. Within 15 to 30 days, status flips to 'Land Seeding: YES', and all held-back installments are released in a lump sum!";
        }

        // 7.2 PM-KISAN eKYC via Face Auth App (No CSC needed)
        if (msg.contains("ekyc") || msg.contains("e-kyc") || msg.contains("ई-केवायसी") || msg.contains("face auth")) {
            return "📲 **How to Complete PM-KISAN e-KYC in 2 Minutes from Home (100% Free):**\n\n" +
                   "You do NOT need to visit a CSC center or pay anyone!\n" +
                   "1. Download **'PM-KISAN Mobile App'** and **'Aadhaar FaceRD App'** from Google Play Store.\n" +
                   "2. Open PM-KISAN App -> Login using Beneficiary Aadhaar Number and OTP.\n" +
                   "3. Click **'e-KYC with Face Authentication'**.\n" +
                   "4. Hold front camera steady in well-lit room and blink eyes when prompted.\n" +
                   "5. System confirms: *'e-KYC Completed Successfully'*. Live status updates within 24 hours.";
        }

        // 7.3 PM-KISAN & Namo Shetkari Overview
        if (msg.contains("pm kisan") || msg.contains("pm-kisan") || msg.contains("namo shetkari") || msg.contains("पीएम किसान") || msg.contains("नमो शेतकरी")) {
            return "🌾 **PM-KISAN & Namo Shetkari Mahasanman Nidhi:**\n\n" +
                   "• **Financial Grant:** ₹6,000/year (PM-KISAN Central) + ₹6,000/year (Namo Shetkari Maharashtra) = **₹12,000 Total per year** credited in ₹2,000 four-monthly installments.\n" +
                   "• **Eligibility:** All cultivable landholding farmer families with land in their name on 7/12 extract.\n" +
                   "• **3 Mandatory Conditions to Receive Installments:**\n" +
                   "  1. **e-KYC Completed:** Biometric or Face Auth verified on pmkisan.gov.in\n" +
                   "  2. **Land Seeding Active:** 7/12 land record mapped in state revenue portal\n" +
                   "  3. **Aadhaar Bank Seeding:** Bank account mapped on NPCI DBT gateway\n" +
                   "• **Official Portal:** [https://pmkisan.gov.in](https://pmkisan.gov.in) | Helpline: 155261 / 1800-115-526";
        }

        // 7.4 Solar Agriculture Pump Subsidy (KUSUM / Magel Tyala)
        if (msg.contains("solar") || msg.contains("kusum") || msg.contains("सौर कृषी पंप") || msg.contains("मागेल त्याला सौर पंप") || msg.contains("pump subsidy")) {
            return "☀️ **Mukhyamantri Saur Krishi Pump / PM-KUSUM Scheme (Solar Agriculture Pumps):**\n\n" +
                   "• **Subsidy:** 90% to 95% government subsidy on 3 HP, 5 HP, and 7.5 HP DC solar water pumps (Farmer pays only 5% to 10% share).\n" +
                   "• **Eligibility:** Farmers with irrigation source (borewell, well, river) without conventional electric agriculture connection.\n" +
                   "• **Official Application Portal:** [https://www.mahadiscom.in/solar_mskpy/index.html](https://www.mahadiscom.in/solar_mskpy/index.html) (MSEDCL Portal)\n" +
                   "• **Required Documents:** 7/12 Extract with water source entry, Aadhaar card, Caste certificate (for SC/ST 95% subsidy), Bank passbook.";
        }

        // 7.5 0% Interest Crop Loan (Pik Karj)
        if (msg.contains("crop loan") || msg.contains("pik karj") || msg.contains("पीक कर्ज") || msg.contains("kcc") || msg.contains("kisan credit card")) {
            return "🌾 **Dr. Panjabrao Deshmukh 0% Interest Crop Loan Scheme (Maharashtra):**\n\n" +
                   "• **Benefit:** Full interest subvention (0% effective interest) on short-term crop loans up to **₹3,00,000** for farmers who repay their loan on time within 1 year.\n" +
                   "• **How to Apply:** Visit your Primary Agricultural Cooperative Society (PACS) or District Central Cooperative Bank (DCCB) / Nationalized bank with 7/12 extract, 8A extract, and No Dues Certificate.\n" +
                   "• **Kisan Credit Card (KCC):** Provides instant revolving cash credit for fertilizers and seeds.";
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 8. WOMEN & FAMILY SCHEMES (SMALL & BIG)
        // ══════════════════════════════════════════════════════════════════════════
        // 8.1 Majhi Ladki Bahin Detailed Questions
        if (msg.contains("ladki bahin") || msg.contains("लाडकी बहीण") || msg.contains("ladki")) {
            return "🌸 **Mukhyamantri Majhi Ladki Bahin Yojana (Maharashtra):**\n\n" +
                   "• **Direct Benefit:** ₹1,500 monthly direct financial assistance (₹18,000 annually) transferred directly to Aadhaar-seeded bank account.\n" +
                   "• **Eligibility:**\n" +
                   "  - Women aged 21 to 65 years\n" +
                   "  - Permanent resident of Maharashtra state\n" +
                   "  - Unmarried, married, widowed, divorced, or deserted women all eligible\n" +
                   "  - Annual family income must not exceed ₹2.5 Lakh\n" +
                   "• **Key Exemption:** If you hold a **Yellow or Orange Ration Card**, you do NOT need a separate Tehsildar Income Certificate! The ration card serves as valid income proof.\n" +
                   "• **Can Multiple Women in Same Family Apply?** Yes! Both daughter-in-law and mother-in-law or unmarried sister can receive the benefit provided individual age conditions are met and total household income is below ₹2.5L.\n" +
                   "• **Official Portal:** [https://ladakibahin.maharashtra.gov.in](https://ladakibahin.maharashtra.gov.in) or Nari Shakti Doot App.";
        }

        // 8.2 Pradhan Mantri Matru Vandana Yojana (PMMVY)
        if (msg.contains("matru vandana") || msg.contains("pmmvy") || msg.contains("मातृ वंदना") || msg.contains("maternity")) {
            return "🤰 **Pradhan Mantri Matru Vandana Yojana (PMMVY):**\n\n" +
                   "• **Cash Incentive:**\n" +
                   "  - **First Child:** ₹5,000 in two installments (₹3,000 at early ANC registration + ₹2,000 after child birth & vaccination).\n" +
                   "  - **Second Child (if girl child):** ₹6,000 in single installment to promote girl child sex ratio.\n" +
                   "• **How to Apply:** Register via your local **Anganwadi Center (Asha worker)** or online on [https://pmmvy.wcd.gov.in](https://pmmvy.wcd.gov.in) using Mother-Child Protection (MCP) card and Aadhaar.";
        }

        // 8.3 Sukanya Samriddhi Yojana (SSY)
        if (msg.contains("sukanya") || msg.contains("सुकन्या समृद्धी") || msg.contains("ssy")) {
            return "👧 **Sukanya Samriddhi Yojana (SSY) - High Interest Savings for Daughters:**\n\n" +
                   "• **Interest Rate:** 8.2% per annum (Compounded annually—one of the highest guaranteed sovereign rates in India).\n" +
                   "• **Eligibility:** Open for girl child from birth up to age 10 years.\n" +
                   "• **Deposit Limits:** Minimum ₹250 per year up to maximum ₹1,50,000 per financial year.\n" +
                   "• **Tax Benefit:** Triple EEE Tax Exemption (Exempt investment under 80C, exempt interest, exempt maturity payout).\n" +
                   "• **Where to Open:** Any Post Office or authorized commercial bank branch with girl child birth certificate and parent's Aadhaar.";
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 9. BUSINESS & SELF-EMPLOYMENT LOANS (SMALL & BIG)
        // ══════════════════════════════════════════════════════════════════════════
        // 9.1 Bank Demands Collateral for Mudra Loan - How to Counter
        if ((msg.contains("mudra") || msg.contains("loan")) && (msg.contains("collateral") || msg.contains("guarantee") || msg.contains("bank refusing") || msg.contains("तारण"))) {
            return "💼 **Problem: Bank Demanding Collateral or Guarantor for PM Mudra Loan:**\n\n" +
                   "• **Statutory Government & RBI Rule:** Under Reserve Bank of India (RBI) circular and PMMY charter, **NO collateral security or third-party guarantor can be demanded for loans up to ₹10,00,000**!\n\n" +
                   "**How to Systematically Tackle the Bank:**\n" +
                   "1. Inform the branch manager politely: *'Under the Credit Guarantee Fund for Micro Units (CGFMU), the Government of India provides 100% guarantee cover to the bank'*\n" +
                   "2. If the branch manager continues to delay or demand bribes, apply online via **UdyamiMitra Portal ([https://www.udyamimitra.in](https://www.udyamimitra.in))** where applications are digitally logged and tracked.\n" +
                   "3. Lodge an escalation ticket with the **State Level Bankers' Committee (SLBC)** or RBI Banking Ombudsman at [https://cms.rbi.org.in](https://cms.rbi.org.in).";
        }

        // 9.2 PM Mudra Yojana Categories
        if (msg.contains("mudra") || msg.contains("मुद्रा") || msg.contains("shishu") || msg.contains("kishor") || msg.contains("tarun")) {
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

        // 9.3 PMEGP 35% Subsidy Loan
        if (msg.contains("pmegp") || msg.contains("subsidy loan") || msg.contains("kvic")) {
            return "🏭 **Prime Minister's Employment Generation Programme (PMEGP):**\n\n" +
                   "• **Government Capital Subsidy:**\n" +
                   "  - **Rural Area:** 25% (General Category) or **35% (SC/ST/OBC/Women/Minority)**\n" +
                   "  - **Urban Area:** 15% (General Category) or **25% (Special Categories)**\n" +
                   "• **Project Ceiling:** Up to ₹50 Lakhs for Manufacturing units and ₹20 Lakhs for Service units.\n" +
                   "• **Own Contribution:** Only 5% to 10% of total project cost.\n" +
                   "• **Official Application Portal:** [https://www.kviconline.gov.in/pmegpeportal](https://www.kviconline.gov.in/pmegpeportal) (Khadi & Village Industries Commission - KVIC).";
        }

        // 9.4 PM SVANidhi (Street Vendors)
        if (msg.contains("svanidhi") || msg.contains("स्वनिधी") || msg.contains("street vendor") || msg.contains("फेरीवाला")) {
            return "🛒 **PM SVANidhi Scheme (Micro-Credit for Street Vendors):**\n\n" +
                   "• **Tranches:** 1st Loan: ₹10,000 -> Repay on time -> 2nd Loan: ₹20,000 -> Repay on time -> 3rd Loan: ₹50,000.\n" +
                   "• **Interest Subsidy:** 7% annual interest subsidy directly credited to bank account.\n" +
                   "• **Digital Cashback:** Up to ₹1,200/year cashback for accepting QR code digital UPI payments.\n" +
                   "• **Requirement:** Vending certificate or letter of recommendation from Urban Local Body / Nagar Palika.\n" +
                   "• **Portal:** [https://pmsvanidhi.mohua.gov.in](https://pmsvanidhi.mohua.gov.in)";
        }

        // 9.5 PM Vishwakarma
        if (msg.contains("vishwakarma") || msg.contains("artisan") || msg.contains("विश्वकर्मा")) {
            return "🛠️ **PM Vishwakarma Scheme (For Artisans & Craftsmen):**\n\n" +
                   "• **Benefits:**\n" +
                   "  - Collateral-free enterprise loan up to ₹3,00,000 at 5% concessional interest (Tranche 1: ₹1 Lakh, Tranche 2: ₹2 Lakh)\n" +
                   "  - ₹15,000 e-voucher for modern toolkits\n" +
                   "  - Free skill training with ₹500 daily stipend\n" +
                   "• **Trades Covered:** 18 traditional crafts including Carpenters (Suthar), Blacksmiths (Lohar), Potters (Kumhaar), Masons (Rajmistri), Cobblers, Tailors (Darzi).\n" +
                   "• **Official Portal:** [https://pmvishwakarma.gov.in](https://pmvishwakarma.gov.in)";
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 10. HEALTH, HOUSING & RATION PROBLEMS (SMALL & BIG)
        // ══════════════════════════════════════════════════════════════════════════
        // 10.1 Ayushman Bharat Cashless Treatment & Hospital Refusal
        if (msg.contains("ayushman") || msg.contains("pm-jay") || msg.contains("pmjay") || msg.contains("mjpjay") || msg.contains("health card") || msg.contains("आयुष्मान")) {
            return "🏥 **Ayushman Bharat PM-JAY & MJPJAY Health Assurance:**\n\n" +
                   "• **Coverage:** Up to **₹5,00,000 cashless hospital treatment** per family per year across 28,000+ empaneled government and private hospitals in India.\n" +
                   "• **Treatments Covered:** 1,949 medical procedures including heart surgery, knee replacements, cancer chemotherapy, neurosurgery, and kidney dialysis.\n" +
                   "• **Hospital Denies Cashless Treatment?**\n" +
                   "  - Every empaneled hospital has an **'Ayushman Mitra' desk** near the reception. Contact the Ayushman Mitra directly.\n" +
                   "  - If hospital insists on cash deposit for empaneled procedures, call the National Anti-Fraud Helpline **14555** immediately while at the hospital.";
        }

        // 10.2 Ration Dealer Deducting Grain or Refusing PMGKAY
        if (msg.contains("ration") || msg.contains("रेशन") || msg.contains("dhanya") || msg.contains("धान्य मिळत नाही") || msg.contains("dealer")) {
            return "🍚 **Problem: Ration Shop Dealer Refusing Free Food Grains or Deducting Weight:**\n\n" +
                   "• **Government Order (PMGKAY):** 5 kg food grains per beneficiary per month are **100% FREE** for Antyodaya (Yellow) and Priority Household (Saffron) cardholders. The dealer cannot charge even 1 Rupee!\n\n" +
                   "**How to Redress Immediately:**\n" +
                   "1. Insist on biometric POS receipt before leaving the shop.\n" +
                   "2. Dial the **State Food & Civil Supplies Toll-Free: 1967** or **1800-22-4950**.\n" +
                   "3. File an online complaint on the RCMS portal ([https://mahaepos.gov.in](https://mahaepos.gov.in)). Supply inspectors are legally bound to inspect the shop within 48 hours.";
        }

        // 10.3 Pradhan Mantri Awas Yojana (PMAY)
        if (msg.contains("awas") || msg.contains("pmay") || msg.contains("gharkul") || msg.contains("घरकुल") || msg.contains("आवास")) {
            return "🏠 **Pradhan Mantri Awas Yojana (PMAY-Gramin & Urban / Gharkul):**\n\n" +
                   "• **PMAY-G (Rural):** Direct financial assistance of ₹1,20,000 (Plains) or ₹1,30,000 (Hilly regions) + ₹24,000 MGNREGA labor wages + ₹12,000 toilet subsidy.\n" +
                   "• **How to Check Your Name in Waiting List:** Open [https://pmayg.nic.in](https://pmayg.nic.in) -> Click **'Stakeholders'** -> **'IAY/PMAYG Beneficiary'** -> Enter Registration Number or Gram Panchayat.\n" +
                   "• **Maharashtra State Subsidies:** Ramai Gharkul (SC/Navboudha), Shabari Gharkul (ST), and Modi Awas Gharkul (OBC) provide equivalent pucca house subsidies.";
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 11. TECHNICAL ISSUES & PUBLIC GRIEVANCE REDRESSAL (SMALL & BIG)
        // ══════════════════════════════════════════════════════════════════════════
        // 11.1 File Upload Size & Resizing Error (Under 100KB/256KB)
        if (msg.contains("upload") || msg.contains("file size") || msg.contains("kb error") || msg.contains("photo size") || msg.contains("साइज")) {
            return "📎 **Problem: 'File Size Exceeds Limit' Error on Govt Portals (MahaDBT/Aaple Sarkar):**\n\n" +
                   "• **Portals typically demand:** Photos < 50KB (JPEG), Signatures < 30KB (JPEG), Documents < 256KB (PDF).\n\n" +
                   "**Quick Solution without Third-Party Apps:**\n" +
                   "1. **Photo/Signature:** Take a clear snapshot on your phone, crop tightly to the edges, and take a screenshot of that cropped view (screenshots are automatically compressed to ~40KB).\n" +
                   "2. **PDF Documents:** When scanning via Microsoft Lens or Google Drive, choose 'Low / Medium Resolution B&W Scan' instead of high-res color photo. Black and white multi-page PDFs easily stay under 150KB.";
        }

        // 11.2 Portal Down on Last Date / Deadline Extension
        if (msg.contains("portal down") || msg.contains("server down") || msg.contains("website not opening") || msg.contains("last date") || msg.contains("शेवटची तारीख")) {
            return "⏳ **Problem: Government Portal Down or Slow on Last Day of Application:**\n\n" +
                   "1. **Use Incognito / Private Window:** Cached cookies cause 'Session Expired' loops. Use Chrome Incognito.\n" +
                   "2. **Apply During Off-Peak Hours:** Peak government server traffic occurs between 11:00 AM and 6:00 PM. The best response times are early morning (6:00 AM - 8:30 AM) or late evening (after 10:00 PM).\n" +
                   "3. **Deadline Extensions:** When statewide portal downtime occurs on a cutoff date, departments (like MahaDBT or CET Cell) routinely issue official Government Resolutions (GR) extending the deadline by 7 to 15 days.";
        }

        // 11.3 Public Grievance Redressal (RTS Appeal & CPGRAMS)
        if (msg.contains("complaint") || msg.contains("grievance") || msg.contains("तक्रार") || msg.contains("appeal") || msg.contains("rts") || msg.contains("cpgrams")) {
            return "⚖️ **How to File Official Complaints Against Delay or Officer Harassment:**\n\n" +
                   "1. **Maharashtra Right to Public Services Act (RTS 2015):**\n" +
                   "   - Every certificate has a statutory legal deadline (e.g. Income Certificate: 15 days).\n" +
                   "   - If not issued in time, file a **1st Appeal online on Aaple Sarkar** to the Sub-Divisional Officer (SDO). The officer has to explain the delay within 30 days.\n" +
                   "2. **Chief Minister Grievance Cell (CM Helpline):** Dial **1800-120-8040** (Toll-Free, 24x7).\n" +
                   "3. **National Central Portal (CPGRAMS):** File an online grievance at [https://pgportal.gov.in](https://pgportal.gov.in). Central government ministries monitor resolution directly.\n" +
                   "4. **Anti-Corruption Bureau (ACB Maharashtra):** If any middleman or official demands a bribe: Dial **1064**.";
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 12. HELPLINE DIRECTORY
        // ══════════════════════════════════════════════════════════════════════════
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
                   "• **Women Helpline (Domestic Abuse & Distress):** 181\n" +
                   "• **National Cyber Crime Helpline:** 1930";
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 13. HOW TO APPLY / PORTAL REDIRECTION
        // ══════════════════════════════════════════════════════════════════════════
        if (msg.contains("how to apply") || msg.contains("apply") || msg.contains("application") || msg.contains("steps") || msg.contains("process") || msg.contains("अर्ज") || msg.contains("आवेदन")) {
            if (schemeName != null) {
                String portalLink = schemeSource != null ? "[" + schemeSource + "](" + schemeSource + ")" : "the official government portal";
                if (isMarathi) {
                    return "📝 **" + schemeName + " साठी अर्ज करण्याची अधिकृत पद्धत:**\n\n" +
                           (applicationSteps != null && !applicationSteps.isBlank() ? applicationSteps.trim() : "1. आवश्यक कागदपत्रे गोळा करा.\n2. अधिकृत शासकीय पोर्टलवर नोंदणी करा.\n3. अर्ज सबमिट करून पोचपावती जतन करा.") + "\n\n" +
                           "🌐 **थेट अर्ज करण्यासाठी अधिकृत पोर्टल:** " + portalLink + "\n\n" +
                           "💡 **थेट प्रवेश:** वरील हिरव्या रंगाच्या *'Apply Officially on Govt Portal'* बटणावर क्लिक करून थेट अधिकृत पोर्टलवर जाऊ शकता!";
                } else {
                    return "📝 **How to Officially Apply for " + schemeName + ":**\n\n" +
                           (applicationSteps != null && !applicationSteps.isBlank() ? applicationSteps.trim() : "1. Gather your in-hand paperwork.\n2. Open the verified government portal.\n3. Complete registration and upload certified documents.\n4. Submit and record acknowledgment number.") + "\n\n" +
                           "🌐 **Verified Government Application Gateway:** " + portalLink + "\n\n" +
                           "💡 **Direct Access:** Click the prominent green button *'Apply Officially on Govt Portal'* at the top or bottom of this page to render directly on the official application site!";
                }
            }
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 14. ELIGIBILITY QUERIES
        // ══════════════════════════════════════════════════════════════════════════
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

        // ══════════════════════════════════════════════════════════════════════════
        // 15. DEFAULT RESPONSES & FALLBACKS
        // ══════════════════════════════════════════════════════════════════════════
        if (schemeName != null) {
            return "ℹ️ **" + schemeName + " Overview:**\n\n" +
                   (schemeDesc != null ? schemeDesc + "\n\n" : "") +
                   "🎁 **Direct Benefit:** " + (schemeBenefit != null ? schemeBenefit : "Financial and welfare support as per guidelines") + "\n\n" +
                   (schemeSource != null ? "🌐 **Official Portal Link:** [" + schemeSource + "](" + schemeSource + ")\n\n" : "") +
                   "Ask me about required documents, how to generate missing certificates, eligibility rules, or how to apply!";
        }

        if (isMarathi) {
            return "🙏 **जनसहाय AI सहाय्यकामध्ये आपले स्वागत आहे!**\n\n" +
                   "मी केंद्र आणि राज्य शासनाच्या 40+ योजना, कागदपत्रांची पूर्तता आणि सर्व लहान-मोठ्या समस्यांचे निवारण करतो.\n\n" +
                   "तुम्ही मला विचारू शकता:\n" +
                   "• *'आधार ओटीपी येत नाही काय करावे?'*\n" +
                   "• *'बँक खात्याला NPCI आधार लिंक कसे करावे?'*\n" +
                   "• *'उत्पन्नाचा दाखला का नाकारला व कसा पुन्हा अर्ज करावा?'*\n" +
                   "• *'लाडकी बहीण योजनेची सविस्तर पात्रता व नियम काय आहेत?'*\n" +
                   "• *'पीएम किसान योजनेचे लँड सीडिंग NO कसे दुरुस्त करावे?'*\n" +
                   "• *'मुद्रा कर्जासाठी बँक तारण मागत असेल तर काय करावे?'*";
        } else if (isHindi) {
            return "🙏 **जनसहाय AI सहायक में आपका स्वागत है!**\n\n" +
                   "मैं सरकारी योजनाओं, दस्तावेजों की तैयारी और हर छोटी-बड़ी समस्या के समाधान के लिए उपलब्ध हूँ।\n\n" +
                   "आप पूछ सकते हैं:\n" +
                   "• *'आधार ओटीपी नहीं आ रहा तो क्या करें?'*\n" +
                   "• *'बैंक खाते को NPCI आधार से कैसे लिंक करें?'*\n" +
                   "• *'आय प्रमाण पत्र खारिज होने पर क्या करें?'*\n" +
                   "• *'पीएम किसान में लैंड सीडिंग NO को कैसे ठीक करें?'*\n" +
                   "• *'मुद्रा लोन के नियम और आवेदन प्रक्रिया क्या है?'*";
        } else {
            return "👋 **Welcome to JanSahay AI Assistant!**\n\n" +
                   "I provide verified solutions for **40+ Central & State government welfare schemes**, document acquisition, and every small or big application problem.\n\n" +
                   "Popular citizen questions you can ask me:\n" +
                   "• *'Aadhaar OTP is not coming / mobile not linked — what to do?'*\n" +
                   "• *'How to link bank account with NPCI mapper for DBT?'*\n" +
                   "• *'Why was my Income Certificate rejected & how to appeal?'*\n" +
                   "• *'How to fix PM-KISAN Land Seeding NO error?'*\n" +
                   "• *'Can I take both State and Central scholarships?'*\n" +
                   "• *'Bank is asking collateral for Mudra loan — how to counter?'*";
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
               lower.contains("ahet") || lower.contains("ahe") || lower.contains("sheti") || lower.contains("kiti") ||
               lower.contains("ओटीपी") || lower.contains("तक्रार") || lower.contains("पैसे");
    }

    private boolean isHindiLanguage(String text) {
        if (text == null) return false;
        String lower = text.toLowerCase();
        return lower.contains("hindi") || lower.contains("हिंदी") || lower.contains("दस्तावेज") ||
               lower.contains("आवेदन") || lower.contains("बताइए") || lower.contains("किसान") ||
               lower.contains("छात्रवृत्ति") || lower.contains("चाहिए") || lower.contains("योजना") ||
               lower.contains("है") || lower.contains("हैं") || lower.contains("कैसे") ||
               lower.contains("समस्या") || lower.contains("प्रमाण पत्र");
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
        Set<String> seen = new HashSet<>();
        for (String p : parts) {
            String item = p.trim();
            if (!item.isEmpty() && !seen.contains(item.toLowerCase())) {
                seen.add(item.toLowerCase());
                sb.append("• ").append(item).append("\n");
            }
        }
        return sb.toString().trim();
    }
}
