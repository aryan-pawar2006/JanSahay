package com.jansahay.service.ai;

import java.util.*;

/**
 * JanSahay Knowledge Base — Comprehensive, Encyclopedic Citizen Intelligence Corpus
 * Contains rich, verified data covering the JanSahay AI Application, all 32 state and central
 * welfare schemes, statutory document acquisition guides (RTS Act 2015), and citizen troubleshooting
 * across English, Marathi, and Hindi.
 */
public class JanSahayKnowledgeBase {

    public static class Topic {
        public final String id;
        public final String[] keywords;
        public final String answerEn;
        public final String answerMr;
        public final String answerHi;

        public Topic(String id, String[] keywords, String answerEn, String answerMr, String answerHi) {
            this.id = id;
            this.keywords = keywords;
            this.answerEn = answerEn;
            this.answerMr = answerMr;
            this.answerHi = answerHi;
        }

        public int matchScore(String query) {
            int score = 0;
            String lower = query.toLowerCase();
            for (String kw : keywords) {
                String kwLower = kw.toLowerCase();
                if (lower.contains(kwLower)) {
                    score += kwLower.length() > 5 ? 3 : 2;
                }
            }
            return score;
        }
    }

    private static final List<Topic> TOPICS = new ArrayList<>();

    static {
        // ══════════════════════════════════════════════════════════════════════
        // 1. JANSAHAY APPLICATION & PROJECT INTELLIGENCE
        // ══════════════════════════════════════════════════════════════════════

        TOPICS.add(new Topic(
            "about-jansahay",
            new String[]{"what is jansahay", "about jansahay", "about this project", "who created", "who made", "what does this app do", "what is this website", "jansahay काय आहे", "जनसहाय क्या है", "project overview"},
            "🇮🇳 **About JanSahay AI 2.0 (Citizen Welfare & Scheme Enablement Platform):**\n\n" +
            "• **Mission:** JanSahay AI is an intelligent, open civic-tech platform designed to bridge the gap between Indian citizens and 40+ verified Central & State government welfare schemes.\n" +
            "• **Key Innovations:**\n" +
            "  1. **Deterministic Eligibility Engine:** Matches your exact age, annual income, social category, landholding, and domicile with 100% mathematical precision—no hallucinations.\n" +
            "  2. **Cross-Scheme Document Deduplication:** If 4 different recommended schemes require an Income Certificate, JanSahay combines them into a single action item on your Document Prep dashboard.\n" +
            "  3. **Official Acquisition Guides:** Step-by-step instructions (under Maharashtra RTS Act 2015) detailing issuing authorities, statutory fees, and verified portal links.\n" +
            "  4. **Direct Government Application Gateways:** One-click redirection to official portals (MahaDBT, Aaple Sarkar, PM-KISAN, Udyam) with zero intermediary fees.\n\n" +
            "💡 *JanSahay is completely free, privacy-first, and never charges citizens for discovering schemes or checking documents.*",
            "🇮🇳 **जनसहाय AI 2.0 बद्दल माहिती (शासकीय योजना व सहाय्य प्रणाली):**\n\n" +
            "• **उद्दिष्ट:** भारतातील सर्वसामान्य नागरिक, विद्यार्थी, शेतकरी आणि महिलांना केंद्र व महाराष्ट्र शासनाच्या 40+ योजनांची अचूक माहिती देणे व कागदपत्रे वेळेत पूर्ण करण्यास मदत करणे.\n" +
            "• **प्रमुख वैशिष्ट्ये:**\n" +
            "  1. **अचूक पात्रता तपासणी:** वय, उत्पन्न, जात वर्ग, शेतजमीन व वास्तव्याच्या आधारे नियमांनुसार अचूक निकाल.\n" +
            "  2. **कागदपत्रांची बचत (Deduplication):** 4 योजनांसाठी उत्पन्नाचा दाखला लागत असल्यास, एकच दाखला कसा सर्व ठिकाणी उपयोगी पडेल हे दाखवले जाते.\n" +
            "  3. **दाखले काढण्याचे मार्गदर्शन:** लोकसेवा हक्क कायदा 2015 नुसार आवश्यक पुरावे, शुल्क आणि शासकीय कार्यालयांची माहिती.\n" +
            "  4. **थेट अधिकृत अर्ज:** महाडीबीटी, आपले सरकार, पीएम किसान अशा अधिकृत सरकारी वेबसाइट्सवर थेट अर्ज करण्याची सुविधा.\n\n" +
            "💡 *जनसहाय AI पूर्णपणे मोफत असून नागरिकांकडून कोणतेही शुल्क आकारले जात नाही.*",
            "🇮🇳 **जनसहाय AI 2.0 के बारे में जानकारी:**\n\n" +
            "• **उद्देश्य:** भारतीय नागरिकों, छात्रों, किसानों और महिला उद्यमियों को केंद्र व राज्य सरकार की 40+ कल्याणकारी योजनाओं से जोड़ना और आवश्यक दस्तावेजों को तैयार कराना।\n" +
            "• **मुख्य विशेषताएं:**\n" +
            "  1. **सटीक पात्रता जांच:** आपकी आयु, आय, वर्ग और भूमि के आधार पर नियमों के अनुसार सही परिणाम।\n" +
            "  2. **दस्तावेजों का एकीकरण:** कई योजनाओं के लिए लगने वाले समान दस्तावेजों को एक जगह व्यवस्थित करना।\n" +
            "  3. **सरकारी प्रमाणपत्र प्रक्रिया:** आय, जाति, अधिवास आदि प्रमाणपत्र बनवाने के चरण-दर-चरण निर्देश।\n" +
            "  4. **सीधा सरकारी पोर्टल लिंक:** महाडीबीटी, पीएम-किसान, उद्यम आदि आधिकारिक पोर्टलों पर सीधे आवेदन की सुविधा।"
        ));

        TOPICS.add(new Topic(
            "how-to-use-jansahay",
            new String[]{"how to use", "how does it work", "steps to use", "how to start", "how do i use", "वापर कसा करावा", "कसा वापरू", "उपयोग कैसे करें", "कैसे काम करता है"},
            "🧭 **How to Use JanSahay AI (Step-by-Step Guide):**\n\n" +
            "1. **Step 1: Complete Your Citizen Profile Wizard:**\n" +
            "   Click **'Profile'** in the navbar to enter your location, category (Student, Farmer, Business, General Citizen), annual income, and in-hand paperwork.\n\n" +
            "2. **Step 2: Explore Matched Scheme Recommendations:**\n" +
            "   Visit **'Recommendations'** to view schemes where you meet all statutory conditions, along with transparent pass/fail criteria.\n\n" +
            "3. **Step 3: Check Document Readiness & Prep Dashboard:**\n" +
            "   Go to **'Document Preparation'** to see missing paperwork, calculate readiness percentages, and view step-by-step acquisition guides.\n\n" +
            "4. **Step 4: Apply Directly on Official Portals:**\n" +
            "   Click **'Apply Officially on Govt Portal'** on any scheme to submit your application directly on the department's authorized portal.",
            "🧭 **जनसहाय AI कसे वापरावे (सविस्तर मार्गदर्शक):**\n\n" +
            "1. **पायरी 1: प्रोफाइल विझार्ड पूर्ण करा:** वर 'Profile' वर क्लिक करून तुमचे राज्य, वय, वार्षिक उत्पन्न, व्यवसाय व सध्या हातात असलेली कागदपत्रे निवडा.\n" +
            "2. **पायरी 2: शिफारस केलेल्या योजना पहा:** 'Recommendations' टॅबमध्ये तुमच्यासाठी पात्र ठरलेल्या सर्व योजनांची यादी व फायदे पहा.\n" +
            "3. **पायरी 3: कागदपत्रे तयारी डॅशबोर्ड:** 'Document Preparation' मध्ये कोणती कागदपत्रे तयार आहेत व कोणती काढायची आहेत ते तपासा.\n" +
            "4. **पायरी 4: अधिकृत पोर्टलवर अर्ज करा:** 'Apply Officially on Govt Portal' बटणावर क्लिक करून थेट सरकारी वेबसाइटवर अर्ज करा.",
            "🧭 **जनसहाय AI का उपयोग कैसे करें:**\n\n" +
            "1. **चरण 1: प्रोफाइल बनाएं:** अपनी आयु, आय, राज्य और वर्तमान दस्तावेजों की जानकारी भरें।\n" +
            "2. **चरण 2: योजनाएं देखें:** 'Recommendations' में अपनी पात्रता के अनुसार योजनाएं और लाभ देखें।\n" +
            "3. **चरण 3: दस्तावेज तैयार करें:** जो दस्तावेज बाकी हैं उन्हें बनवाने की प्रक्रिया समझें।\n" +
            "4. **चरण 4: सीधा आवेदन करें:** आधिकारिक सरकारी पोर्टल पर जाकर ऑनलाइन आवेदन जमा करें।"
        ));

        TOPICS.add(new Topic(
            "demo-logins",
            new String[]{"demo account", "quick login", "test accounts", "rahul", "ramesh", "priya", "डेमो खाती", "लॉगिन कसे करू", "टेस्ट अकाउंट", "demo login"},
            "🔑 **JanSahay Quick Demo Personas (Instant 1-Click Login):**\n\n" +
            "You can test the full functionality immediately using our pre-configured citizen profiles:\n\n" +
            "• 🎓 **Student Demo (Rahul Patil):**\n" +
            "  - *Profile:* Open category college student, Pune, family income ₹2.5 Lakhs.\n" +
            "  - *Focus Schemes:* EBC Scholarship (50% fee waiver), Dr. Punjabrao Deshmukh Hostel Allowance.\n\n" +
            "• 🌾 **Farmer Demo (Ramesh Shinde):**\n" +
            "  - *Profile:* Small & marginal farmer, Ahmednagar, 1.8 hectares landholding.\n" +
            "  - *Focus Schemes:* PM-KISAN (₹6,000/yr), Namo Shetkari Mahasanman Nidhi (₹6,000/yr = ₹12,000 total), Magel Tyala Shet Tale.\n\n" +
            "• 💼 **Business / Women Demo (Priya Deshmukh):**\n" +
            "  - *Profile:* Women entrepreneur, Mumbai, starting a food processing MSME.\n" +
            "  - *Focus Schemes:* Maharashtra Ladki Bahin Yojana (₹1,500/mo), CMEGP (35% subsidy), PMMY Mudra Loan.\n\n" +
            "💡 *Click any Demo button in the top navigation bar to login with one click!*",
            "🔑 **जनसहाय इन्स्टंट डेमो प्रोफाइल्स (१-क्लिक लॉगिन):**\n\n" +
            "• 🎓 **विद्यार्थी डेमो (राहुल पाटील):** ईबीसी शिष्यवृत्ती (५०% फी माफी) आणि पंजाबराव देशमुख वसतिगृह भत्ता.\n" +
            "• 🌾 **शेतकरी डेमो (रमेश शिंदे):** पीएम किसान (₹६,०००) + नमो शेतकरी महासन्मान (₹६,०००) = एकूण ₹१२,००० वार्षिक अनुदान.\n" +
            "• 💼 **महिला / व्यवसाय डेमो (प्रिया देशमुख):** मुख्यमंत्री लाडकी बहीण योजना (₹१,५००/महिना), CMEGP व्यवसाय अनुदान (३५% सबसिडी) आणि मुद्रा कर्ज.\n\n" +
            "💡 *वर उजव्या बाजूला असलेल्या डेमो बटणावर क्लिक करून थेट लॉगिन करू शकता!*",
            "🔑 **जनसहाय डेमो खाते (1-क्लिक लॉगिन):**\n\n" +
            "• 🎓 **छात्र डेमो (राहुल पाटिल):** ईबीसी छात्रवृत्ति और छात्रावास भत्ता।\n" +
            "• 🌾 **किसान डेमो (रमेश शिंदे):** पीएम किसान (₹6,000) और नमो शेतकरी योजना (कुल ₹12,000 सालाना)।\n" +
            "• 💼 **महिला / उद्योग डेमो (प्रिया देशमुख):** लाडकी बहिन योजना (₹1,500/माह), CMEGP 35% सब्सिडी और मुद्रा लोन।"
        ));

        TOPICS.add(new Topic(
            "fees-charges",
            new String[]{"is it free", "cost", "charge", "fee", "money", "payment", "पैसा लागतो का", "मोफत आहे का", "चार्ज", "फीस", "शुल्क"},
            "🆓 **JanSahay AI Service Fees & Cost Policy:**\n\n" +
            "• **JanSahay AI is 100% Free of Cost:** We never charge any fee for discovering schemes, checking eligibility, preparing checklists, or using the AI Assistant.\n" +
            "• **Government Statutory RTS Fees:** When you apply for official certificates (like Income, Domicile, or Caste) on state portals like Aaple Sarkar, the government charges nominal statutory fees (typically ₹33 to ₹57 per certificate under the Right to Services Act).\n" +
            "• **Beware of Fraudsters:** Never pay private agents or unauthorized cyber cafes extra money for free government schemes. Always use official government portals linked inside JanSahay.",
            "🆓 **जनसहाय AI व सरकारी फी धोरण:**\n\n" +
            "• **जनसहाय AI पूर्णपणे मोफत आहे:** योजनांची माहिती, पात्रता तपासणी व कागदपत्रे मार्गदर्शनासाठी आम्ही एक रुपयाही आकारत नाही.\n" +
            "• **शासकीय लोकसेवा हक्क फी:** आपले सरकार पोर्टलवर दाखला काढताना शासन नाममात्र ₹३३ ते ₹५७ इतकीच अधिकृत शासकीय फी आकारते.\n" +
            "• **दलालांपासून सावध रहा:** कोणत्याही योजनेसाठी किंवा अर्जासाठी खाजगी दलालांना पैसे देऊ नका. जनसहायमधील अधिकृत लिंक्सचाच वापर करा.",
            "🆓 **शुल्क व खर्च नीति:**\n\n" +
            "• **जनसहाय AI शत-प्रतिशत निःशुल्क है:** योजना खोजने, पात्रता जांचने और AI चैटबॉट के उपयोग के लिए कोई शुल्क नहीं है।\n" +
            "• **सरकारी पोर्टल शुल्क:** आपले सरकार पोर्टल पर प्रमाणपत्रों के लिए केवल सरकारी नियमानुसार ₹33 से ₹57 की सांविधिक फीस लगती है।"
        ));

        // ══════════════════════════════════════════════════════════════════════
        // 2. SCHEMES ENCYCLOPEDIA (ALL MAJOR SCHEMES COVERED)
        // ══════════════════════════════════════════════════════════════════════

        TOPICS.add(new Topic(
            "ebc-scholarship",
            new String[]{"ebc", "shahu maharaj", "ebc scholarship", "open category scholarship", "tuition fee waiver", "ईबीसी", "ईबीसी शिष्यवृत्ती", "शाहू महाराज शिष्यवृत्ती"},
            "🎓 **Rajarshi Chhatrapati Shahu Maharaj EBC Scholarship (Maharashtra):**\n\n" +
            "• **Benefit:** 50% reimbursement of Tuition Fees and Exam Fees for higher professional education (Engineering, Medical, Pharmacy, MBA, Polytechnic, Degree).\n" +
            "• **Eligibility Criteria:**\n" +
            "  1. Resident of Maharashtra (Valid Domicile Certificate required).\n" +
            "  2. Category: General / Open / SEBC (Without any other caste scholarship).\n" +
            "  3. Family Annual Income: Up to ₹8,00,000 (Tahasildar Income Certificate).\n" +
            "  4. Admission must be through CAP (Centralized Admission Process) round.\n" +
            "  5. Maximum 2 children from the same family can avail this benefit.\n" +
            "• **Key Documents Required:** 1) Domicile Certificate, 2) Tahasildar Income Certificate (<= ₹8L), 3) CAP Allotment Letter, 4) Current Year College Fee Receipt, 5) Aadhaar-seeded Bank Passbook.\n" +
            "• **Official Application Portal:** [https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in)",
            "🎓 **राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती (EBC):**\n\n" +
            "• **फायदा:** उच्च व तंत्रशिक्षणासाठी (इंजिनिअरिंग, फार्मसी, एमबीए, डिग्री) ५०% शिक्षण शुल्क व परीक्षा फी माफी.\n" +
            "• **पात्रता अटी:**\n" +
            "  १. महाराष्ट्राचा रहिवासी (अधिवास/डोमिसाईल प्रमाणपत्र आवश्यक).\n" +
            "  २. प्रवर्ग: खुला / जनरल (Open) प्रवर्ग.\n" +
            "  ३. कौटुंबिक वार्षिक उत्पन्न मर्यादा: ₹८,००,००० पर्यंत (तहसीलदार दाखला).\n" +
            "  ४. प्रवेश कॅप (CAP Round) द्वारे झालेला असावा.\n" +
            "• **आवश्यक कागदपत्रे:** अधिवास प्रमाणपत्र, उत्पन्नाचा दाखला (८ लाखांच्या आत), कॅप अलॉटमेंट लेटर, चालू वर्षाची फी पावती, आधार लिंक बँक पासबुक.\n" +
            "• **अधिकृत पोर्टल:** [https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in)",
            "🎓 **राजर्षि छत्रपति शाहू महाराज ईबीसी (EBC) छात्रवृत्ति:**\n\n" +
            "• **लाभ:** सामान्य (Open) वर्ग के छात्रों को उच्च शिक्षा में 50% ट्यूशन फीस और परीक्षा फीस की प्रतिपूर्ति।\n" +
            "• **पात्रता:** महाराष्ट्र का डोमिसाइल, परिवार की वार्षिक आय ₹8 लाख तक, कैप (CAP) राउंड से प्रवेश।\n" +
            "• **दस्तावेज:** डोमिसाइल, आय प्रमाण पत्र, कैप अलॉटमेंट लेटर, फीस रसीद, आधार लिंक बैंक खाता।\n" +
            "• **पोर्टल:** [https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in)"
        ));

        TOPICS.add(new Topic(
            "punjabrao-deshmukh",
            new String[]{"punjabrao", "hostel", "vastigruh", "hostel allowance", "nirvah bhatta", "पंजाबराव", "वसतिगृह भत्ता", "हॉस्टेल भत्ता"},
            "🏠 **Dr. Punjabrao Deshmukh Vastigruh Nirvah Bhatta Yojna (Maharashtra):**\n\n" +
            "• **Benefit:** Monthly hostel and maintenance allowance paid directly into student bank accounts:\n" +
            "  - **₹30,000 per year** (₹3,000/month for 10 months) for students studying in MMRDA (Mumbai), Pune, or Nagpur.\n" +
            "  - **₹20,000 per year** (₹2,000/month for 10 months) for students studying in other districts.\n" +
            "• **Eligibility Criteria:**\n" +
            "  1. Children of registered Small & Marginal Farmers (alpabhudharak) OR registered Construction Workers (BOCW).\n" +
            "  2. Student must be studying in a technical/professional college away from native taluka/village.\n" +
            "  3. Annual family income up to ₹8,00,000 (if alpabhudharak certificate is attached).\n" +
            "• **Key Documents Required:** 1) 7/12 Land Extract with Alpabhudharak (Small Farmer) certificate OR BOCW Labor Card, 2) Hostel Bonafide Certificate OR Registered Rent Agreement with Owner PAN, 3) College Bonafide & Fee Receipt, 4) Domicile Certificate.\n" +
            "• **Official Portal:** [https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in)",
            "🏠 **डॉ. पंजाबराव देशमुख वसतिगृह निर्वाह भत्ता योजना:**\n\n" +
            "• **फायदा:** विद्यार्थ्यांना राहण्यासाठी व जेवणासाठी थेट बँक खात्यात अनुदान:\n" +
            "  - मुंबई (MMRDA), पुणे, नागपूर येथे शिकणाऱ्यांसाठी: **₹३०,००० प्रति वर्ष**.\n" +
            "  - इतर जिल्ह्यांत शिकणाऱ्यांसाठी: **₹२०,००० प्रति वर्ष**.\n" +
            "• **पात्रता:** अल्पभूधारक शेतकरी (२ हेक्टरपर्यंत शेती) किंवा नोंदणीकृत बांधकाम मजुरांची मुले; गाव सोडून बाहेर शिकत असणे आवश्यक.\n" +
            "• **कागदपत्रे:** ७/१२ उतारा व अल्पभूधारक दाखला / बांधकाम मजूर नोंदणी, वसतिगृह बोनाफाइड किंवा भाडे करारनामा (Rent Agreement), अधिवास प्रमाणपत्र.\n" +
            "• **अधिकृत पोर्टल:** [https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in)",
            "🏠 **डॉ. पंजाबराव देशमुख छात्रावास निर्वाह भत्ता योजना:**\n\n" +
            "• **लाभ:** बाहर रहकर पढ़ने वाले छात्रों को ₹20,000 से ₹30,000 वार्षिक छात्रावास और निर्वाह भत्ता।\n" +
            "• **पात्रता:** अल्पभूधारक किसानों अथवा पंजीकृत निर्माण श्रमिकों के बच्चे जो उच्च शिक्षा प्राप्त कर रहे हैं।\n" +
            "• **दस्तावेज:** 7/12 खतौनी, अल्पभूधारक प्रमाण, हॉस्टल बोनाफाइड/रेंट एग्रीमेंट, डोमिसाइल।"
        ));

        TOPICS.add(new Topic(
            "pm-kisan",
            new String[]{"pm kisan", "pmkisan", "kisan samman", "6000", "farmer installment", "पीएम किसान", "किसान सन्मान निधी", "शेतकरी ६०००", "ekyc"},
            "🌾 **Pradhan Mantri Kisan Samman Nidhi (PM-KISAN):**\n\n" +
            "• **Benefit:** ₹6,000 per year transferred directly to landholding farmer bank accounts in three equal installments of ₹2,00,0 every 4 months.\n" +
            "• **Eligibility Criteria:**\n" +
            "  1. Farmer families holding cultivable agricultural land in their name in state land records.\n" +
            "  2. *Exclusions:* Institutional landholders, serving/retired government employees, income tax payers in last assessment year, doctors/engineers/lawyers.\n" +
            "• **Mandatory Prerequisites to Avoid Payment Bounces:**\n" +
            "  1. **e-KYC Completion:** Mandatory biometric or Aadhaar OTP authentication on [https://pmkisan.gov.in](https://pmkisan.gov.in).\n" +
            "  2. **Land Seeding (Yes):** Land ownership mapped with PM-KISAN portal by the Talathi / Agriculture Department.\n" +
            "  3. **Aadhaar-NPCI Seeding:** Bank account must be mapped for DBT on NPCI Mapper.\n" +
            "• **Helpline:** Toll-Free 155261 / 1800-115526",
            "🌾 **प्रधानमंत्री किसान सन्मान निधी (PM-KISAN):**\n\n" +
            "• **फायदा:** शेतकरी कुटुंबांना दरवर्षी ₹६,००० थेट बँक खात्यात (दर चार महिन्यांनी ₹२,००० चे तीन हप्ते).\n" +
            "• **पात्रता:** स्वतःच्या नावावर शेतजमीन असलेले शेतकरी कुटुंब (सरकारी नोकरदार व आयकर भरणारे वगळून).\n" +
            "• **हप्ता मिळण्यासाठी ३ आवश्यक गोष्टी:**\n" +
            "  १. **e-KYC पूर्ण असणे:** पीएम किसान पोर्टलवर आधार ओटीपीद्वारे e-KYC करणे बंधनकारक.\n" +
            "  २. **लँड सीडिंग (Land Seeding YES):** ७/१२ उतारा कृषी विभागामार्फत पोर्टलवर लिंक असणे.\n" +
            "  ३. **बँक खात्याला NPCI आधार लिंक असणे:** पैसे थेट खात्यात जमा होण्यासाठी आवश्यक.\n" +
            "• **हेल्पलाईन:** १५५२६१ / १८००-११५५२६",
            "🌾 **प्रधानमंत्री किसान सम्मान निधि (PM-KISAN):**\n\n" +
            "• **लाभ:** किसानों को प्रति वर्ष ₹6,000 की आर्थिक सहायता (₹2,000 की 3 किस्तें)।\n" +
            "• **पात्रता:** खेती योग्य भूमि के स्वामी किसान परिवार।\n" +
            "• **जरूरी शर्तें:** e-KYC पूरा होना, लैंड सीडिंग (Land Seeding) 'Yes' होना और बैंक खाते में आधार NPCI मैप होना।"
        ));

        TOPICS.add(new Topic(
            "namo-shetkari",
            new String[]{"namo shetkari", "mahasanman", "12000 farmer", "maharashtra farmer 6000", "नमो शेतकरी", "नमो महासन्मान", "शेतकरी १२ हजार"},
            "🌾 **Namo Shetkari Mahasanman Nidhi Yojana (Maharashtra):**\n\n" +
            "• **Benefit:** Additional ₹6,000 per year provided by the Government of Maharashtra to all PM-KISAN beneficiaries in the state.\n" +
            "• **Total Combined Benefit:** Combined with PM-KISAN (₹6,000), Maharashtra farmers receive **₹12,000 per year** in total direct bank transfers.\n" +
            "• **Eligibility:** Any farmer resident in Maharashtra who is already approved and receiving PM-KISAN installments is automatically eligible.\n" +
            "• **No Separate Application Needed:** If your PM-KISAN eKYC, Land Seeding, and NPCI status are active, Namo Shetkari installments are deposited automatically.\n" +
            "• **Official Portal:** [https://krishi.maharashtra.gov.in](https://krishi.maharashtra.gov.in)",
            "🌾 **नमो शेतकरी महासन्मान निधी योजना (महाराष्ट्र शासन):**\n\n" +
            "• **फायदा:** महाराष्ट्र शासनाकडून शेतकऱ्यांना अतिरिक्त ₹६,००० प्रति वर्ष अनुदान.\n" +
            "• **एकूण एकत्रित लाभ:** केंद्र शासनाचे ₹६,००० (PM-KISAN) + महाराष्ट्र शासनाचे ₹६,००० (नमो शेतकरी) = **एकूण ₹१२,००० प्रति वर्ष**.\n" +
            "• **पात्रता:** महाराष्ट्रातील सर्व शेतकरी जे केंद्र शासनाच्या PM-KISAN योजनेसाठी पात्र आहेत.\n" +
            "• **वेगळा अर्ज करण्याची गरज नाही:** पीएम किसानचे लँड सीडिंग आणि e-KYC पूर्ण असल्यास हे पैसे थेट खात्यात जमा होतात.",
            "🌾 **नमो शेतकरी महासम्मान निधि योजना (महाराष्ट्र):**\n\n" +
            "• **लाभ:** महाराष्ट्र सरकार द्वारा किसानों को अतिरिक्त ₹6,000 प्रति वर्ष। पीएम-किसान के साथ मिलाकर कुल **₹12,000 सालाना**।\n" +
            "• **पात्रता:** महाराष्ट्र के सभी पीएम-किसान लाभार्थी किसान।"
        ));

        TOPICS.add(new Topic(
            "ladki-bahin",
            new String[]{"ladki bahin", "ladki bahin yojana", "1500", "women 1500", "majhi ladki bahin", "लाडकी बहीण", "लाडकी बहीण योजना", "माझी लाडकी बहीण", "१५००"},
            "🌸 **Mukhyamantri Majhi Ladki Bahin Yojana (Maharashtra):**\n\n" +
            "• **Benefit:** ₹1,500 per month (₹18,000 per year) transferred directly into eligible women's Aadhaar-linked bank accounts.\n" +
            "• **Eligibility Criteria:**\n" +
            "  1. Resident of Maharashtra state.\n" +
            "  2. Age: Between 21 and 65 years.\n" +
            "  3. Marital Status: Married, unmarried, widowed, divorced, or abandoned women.\n" +
            "  4. Family Annual Income: Up to ₹2,50,000 (Exempt from income certificate if family holds Yellow or Saffron Ration Card).\n" +
            "  5. Only one unmarried woman in the family if multiple unmarried women exist; married woman receives separate benefit.\n" +
            "• **Key Documents Required:** 1) Aadhaar Card, 2) Maharashtra Domicile / Ration Card / Birth Certificate, 3) Bank Passbook (Aadhaar Seeded), 4) Income Certificate or Yellow/Saffron Ration Card, 5) Hamipatra (Self-declaration).\n" +
            "• **Official Application Portal:** [https://ladakibahin.maharashtra.gov.in](https://ladakibahin.maharashtra.gov.in) or Nari Shakti Doot App.",
            "🌸 **मुख्यमंत्री माझी लाडकी बहीण योजना (महाराष्ट्र शासन):**\n\n" +
            "• **फायदा:** पात्र महिलांना दरमहा **₹१,५००** (वार्षिक ₹१८,०००) थेट आधार लिंक बँक खात्यात.\n" +
            "• **पात्रता अटी:**\n" +
            "  १. महाराष्ट्राची रहिवासी असणे आवश्यक.\n" +
            "  २. वयोमर्यादा: २१ ते ६५ वर्षे.\n" +
            "  ३. वैवाहिक स्थिती: विवाहित, विधवा, घटस्फोटित, परित्यक्ता आणि अविवाहित महिला.\n" +
            "  ४. कौटुंबिक वार्षिक उत्पन्न मर्यादा: ₹२,५०,००० पर्यंत. (पिवळे किंवा केशरी रेशनकार्ड असल्यास उत्पन्नाच्या दाखल्याची गरज नाही!)\n" +
            "• **आवश्यक कागदपत्रे:** आधार कार्ड, अधिवास प्रमाणपत्र (किंवा १५ वर्षांपूर्वीचे रेशन कार्ड/शाळा सोडल्याचा दाखला), पिवळे/केशरी रेशन कार्ड, आधार लिंक बँक पासबुक, हमीपत्र.\n" +
            "• **अधिकृत पोर्टल:** [https://ladakibahin.maharashtra.gov.in](https://ladakibahin.maharashtra.gov.in)",
            "🌸 **मुख्यमंत्री माझी लाडकी बहिन योजना (महाराष्ट्र):**\n\n" +
            "• **लाभ:** पात्र महिलाओं को प्रति माह **₹1,500** (वार्षिक ₹18,000) सीधा बैंक खाते में।\n" +
            "• **पात्रता:** आयु 21 से 65 वर्ष, महाराष्ट्र की निवासी, परिवार की वार्षिक आय ₹2.5 लाख तक (पीला/केसरी राशन कार्ड होने पर आय प्रमाण पत्र की छूट)।\n" +
            "• **दस्तावेज:** आधार कार्ड, राशन कार्ड/डोमिसाइल, आधार लिंक बैंक खाता, स्व-घोषणा पत्र।"
        ));

        TOPICS.add(new Topic(
            "mudra-loan",
            new String[]{"mudra", "pmmy", "mudra loan", "business loan", "shishu", "kishore", "tarun", "मुद्रा कर्ज", "मुद्रा लोन", "उद्योग कर्ज"},
            "💼 **Pradhan Mantri Mudra Yojana (PMMY) - Collateral-Free Business Loans:**\n\n" +
            "• **Benefit:** Institutional micro-credit up to ₹10 Lakhs without pledging any property, land, or gold as collateral.\n" +
            "• **Loan Categories:**\n" +
            "  1. **Shishu Tier:** Loans up to ₹50,000 (for new micro-startups, vendors, artisans).\n" +
            "  2. **Kishore Tier:** Loans from ₹50,000 up to ₹5,00,000 (for buying machinery, tools, inventory).\n" +
            "  3. **Tarun Tier:** Loans from ₹5,00,000 up to ₹10,00,000 (for expanding established enterprises).\n" +
            "• **Legal Right:** As per Reserve Bank of India (RBI) guidelines, **banks CANNOT demand collateral security** for Mudra loans up to ₹10 Lakhs!\n" +
            "• **Key Documents Required:** 1) Udyam MSME Registration Certificate (Free online), 2) Business Project Report / Quotation, 3) 6-month Bank Statement, 4) PAN & Aadhaar Card, 5) Proof of Business Address.\n" +
            "• **Official Application Portal:** [https://www.udyamimitra.in](https://www.udyamimitra.in) or visit any nationalized bank branch.",
            "💼 **प्रधानमंत्री मुद्रा कर्ज योजना (PMMY) - तारणमुक्त व्यवसाय कर्ज:**\n\n" +
            "• **फायदा:** कोणत्याही जमिनीचे किंवा घराचे तारण (Collateral) न देता ₹१० लाखांपर्यंत व्यवसाय कर्ज.\n" +
            "• **कर्जाचे ३ प्रकार:**\n" +
            "  १. **शिशू (Shishu):** ₹५०,००० पर्यंत कर्ज (लहान विक्रेते, नवीन सुरू होणारे व्यवसाय).\n" +
            "  २. **किशोर (Kishore):** ₹५०,००० ते ₹५,००,००० पर्यंत कर्ज (यंत्रसामग्री, कच्चा माल).\n" +
            "  ३. **तरुण (Tarun):** ₹५,००,००० ते ₹१०,००,००० पर्यंत कर्ज (व्यवसाय विस्तारासाठी).\n" +
            "• **महत्त्वाचा नियम:** रिझर्व्ह बँकेच्या (RBI) नियमांनुसार मुद्रा कर्जासाठी बँक **कोणतेही तारण किंवा गॅरंटी मागू शकत नाही**!\n" +
            "• **कागदपत्रे:** उद्यम आधार (MSME नोंदणी), प्रोजेक्ट रिपोर्ट/कोटेशन, ६ महिन्यांचे बँक स्टेटमेंट, पॅन व आधार कार्ड.\n" +
            "• **पोर्टल:** [https://www.udyamimitra.in](https://www.udyamimitra.in)",
            "💼 **प्रधानमंत्री मुद्रा लोन योजना (PMMY):**\n\n" +
            "• **लाभ:** बिना किसी गारंटी/सिक्योरिटी के ₹10 लाख तक का बिजनेस लोन।\n" +
            "• **श्रेणियां:** शिशु (₹50,000 तक), किशोर (₹50,000 से ₹5 लाख), तरुण (₹5 लाख से ₹10 लाख)।\n" +
            "• **नियम:** RBI के अनुसार ₹10 लाख तक के मुद्रा लोन पर बैंक कोई गिरवी संपत्ति नहीं मांग सकता।"
        ));

        TOPICS.add(new Topic(
            "cmegp-maharashtra",
            new String[]{"cmegp", "chief minister employment", "subsidy loan", "business subsidy", "सीएमईजीपी", "मुख्यमंत्री रोजगार निर्मिती"},
            "🏭 **Chief Minister Employment Generation Programme (CMEGP - Maharashtra):**\n\n" +
            "• **Benefit:** Credit-linked capital subsidy program for self-employment ventures in Maharashtra:\n" +
            "  - **Manufacturing Projects:** Project cost up to **₹50 Lakhs**.\n" +
            "  - **Service / Business Projects:** Project cost up to **₹20 Lakhs**.\n" +
            "  - **Government Subsidy:** 15% to 35% of total project cost (e.g. up to ₹17.5 Lakhs non-repayable grant for women/SC/ST in rural areas).\n" +
            "• **Eligibility Criteria:**\n" +
            "  1. Resident of Maharashtra aged 18 to 45 years (up to 50 years for SC/ST/Women/Ex-servicemen).\n" +
            "  2. Educational Qualification: 7th pass for projects > ₹10 Lakhs; 10th pass for projects > ₹25 Lakhs.\n" +
            "• **Key Documents Required:** 1) Detailed Project Report (DPR), 2) Maharashtra Domicile Certificate, 3) Aadhaar & PAN Card, 4) Educational Marksheets, 5) Caste Certificate (if claiming special category subsidy).\n" +
            "• **Official Application Portal:** [https://maha-cmegp.gov.in](https://maha-cmegp.gov.in)",
            "🏭 **मुख्यमंत्री रोजगार निर्मिती कार्यक्रम (CMEGP महाराष्ट्र):**\n\n" +
            "• **फायदा:** स्वतःचा व्यवसाय किंवा कारखाना सुरू करण्यासाठी १५% ते ३५% शासकीय अनुदान (सबसिडी):\n" +
            "  - उत्पादन उद्योग (Manufacturing): **₹५० लाखांपर्यंत** प्रकल्प खर्च.\n" +
            "  - सेवा उद्योग (Service): **₹२० लाखांपर्यंत** प्रकल्प खर्च.\n" +
            "• **पात्रता:** वय १८ ते ४५ वर्षे (महिला/मागासवर्गीयांसाठी ५० वर्षांपर्यंत), किमान ७ वी/१० वी उत्तीर्ण.\n" +
            "• **आवश्यक कागदपत्रे:** सविस्तर प्रकल्प अहवाल (DPR), अधिवास प्रमाणपत्र, आधार व पॅन कार्ड, शैक्षणिक दाखले.\n" +
            "• **अधिकृत पोर्टल:** [https://maha-cmegp.gov.in](https://maha-cmegp.gov.in)",
            "🏭 **मुख्यमंत्री रोजगार सृजन कार्यक्रम (CMEGP महाराष्ट्र):**\n\n" +
            "• **लाभ:** उद्योग शुरू करने के लिए 15% से 35% तक सरकारी सब्सिडी (विनिर्माण में ₹50 लाख और सेवा में ₹20 लाख तक)।\n" +
            "• **पात्रता:** आयु 18 से 45 वर्ष (आरक्षित वर्ग हेतु 50 वर्ष), 7वीं/10वीं पास।"
        ));

        TOPICS.add(new Topic(
            "ayushman-bharat",
            new String[]{"ayushman", "pmjay", "ayushman bharat", "golden card", "5 lakh health", "आयुष्मान भारत", "आयुष्मान कार्ड", "५ लाख मोफत उपचार"},
            "🏥 **Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY):**\n\n" +
            "• **Benefit:** Cashless and paperless hospitalization treatment of up to **₹5,00,000 per family per year** for secondary and tertiary medical care.\n" +
            "• **Coverage:** Covers 1,949 medical and surgical procedures across 27,000+ empanelled government and private hospitals across India (including ICU, surgeries, pre- and post-hospitalization medications).\n" +
            "• **Who is Eligible:**\n" +
            "  - Families identified under the Socio-Economic Caste Census (SECC 2011) database.\n" +
            "  - All senior citizens aged 70+ (new universal coverage regardless of income).\n" +
            "• **How to Download Ayushman Golden Card:**\n" +
            "  1. Visit [https://beneficiary.nha.gov.in](https://beneficiary.nha.gov.in).\n" +
            "  2. Select Beneficiary -> Enter mobile number -> Login with OTP.\n" +
            "  3. Search by Ration Card or Aadhaar number -> Complete Face/OTP eKYC -> Download Card instantly.\n" +
            "• **National Helpline:** 14555",
            "🏥 **आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (PM-JAY):**\n\n" +
            "• **फायदा:** देशभरातील २७,०००+ सरकारी व खाजगी रुग्णालयांत प्रति कुटुंब दरवर्षी **₹५,००,००० पर्यंत मोफत व कॅशलेस उपचार**.\n" +
            "• **समाविष्ट उपचार:** गंभीर आजार, शस्त्रक्रिया, अतिदक्षता विभाग (ICU), औषधोपचार व तपासण्यांचा खर्च.\n" +
            "• **कार्ड कसे काढायचे (Golden Card):**\n" +
            "  १. [https://beneficiary.nha.gov.in](https://beneficiary.nha.gov.in) वर जा.\n" +
            "  २. रेशन कार्ड किंवा आधार नंबर टाकून नाव शोधा.\n" +
            "  ३. ई-केवायसी पूर्ण करून डिजिटल आयुष्मान कार्ड डाऊनलोड करा.\n" +
            "• **राष्ट्रीय टोल-फ्री नंबर:** १४५५५",
            "🏥 **आयुष्मान भारत (PM-JAY) योजना:**\n\n" +
            "• **लाभ:** प्रति परिवार प्रति वर्ष ₹5 लाख तक का निःशुल्क कैशलेस अस्पताल उपचार।\n" +
            "• **कार्ड कैसे बनाएं:** beneficiary.nha.gov.in पोर्टल पर जाकर आधार अथवा राशन कार्ड से eKYC करें और कार्ड डाउनलोड करें।\n" +
            "• **हेल्पलाइन:** 14555"
        ));

        TOPICS.add(new Topic(
            "pm-vishwakarma",
            new String[]{"vishwakarma", "pm vishwakarma", "15000 toolkit", "artisan scheme", "विश्वकर्मा", "पीएम विश्वकर्मा", "कारागीर योजना"},
            "🛠️ **PM Vishwakarma Scheme (Support for Traditional Artisans & Craftsmen):**\n\n" +
            "• **Benefit:** Comprehensive holistic support for 18 traditional trades (Carpenters, Blacksmiths, Potters, Masons, Tailors, Barbers, Cobblers, etc.):\n" +
            "  1. **PM Vishwakarma Certificate & ID Card:** Official national artisan recognition.\n" +
            "  2. **Free Modern Skill Training:** 5 to 7 days basic training with **₹500 daily stipend**.\n" +
            "  3. **₹15,000 Toolkit Incentive:** Transferred directly as e-vouchers to purchase modern equipment.\n" +
            "  4. **Subsidized Collateral-Free Loans:** First tranche of ₹1,00,000 (repayable in 18 months); Second tranche of ₹2,00,000 (repayable in 30 months) at **concessional 5% interest**.\n" +
            "• **Eligibility:** Minimum age 18 years, engaged in one of the 18 eligible traditional family trades, not availed PMEGP/Mudra in last 5 years.\n" +
            "• **Official Application Portal:** [https://pmvishwakarma.gov.in](https://pmvishwakarma.gov.in) (Enroll at any CSC Kendra).",
            "🛠️ **पीएम विश्वकर्मा योजना (पारंपरिक कारागीर व बलुतेदार सहाय्य):**\n\n" +
            "• **फायदा:** १८ पारंपरिक बलुतेदार व्यवसायांसाठी (सुतार, लोहार, कुंभार, गवंडी, शिंपी, नाभिक इ.):\n" +
            "  १. **₹१५,००० टूलकिट अनुदान:** आधुनिक अवजारे खरेदीसाठी थेट व्हाउचर.\n" +
            "  २. **मोफत प्रशिक्षण:** दररोज ₹५०० विद्यावेतनासह ५ ते ७ दिवसांचे प्रशिक्षण.\n" +
            "  ३. **कमी व्याजाचे कर्ज:** फक्त ५% सवलतीच्या व्याजदराने ₹३ लाखांपर्यंत तारणमुक्त कर्ज (पहिला हप्ता ₹१ लाख, दुसरा ₹२ लाख).\n" +
            "• **नोंदणी:** जवळच्या सीएससी (CSC) केंद्रात जाऊन बायोमेट्रिक पडताळणीसह मोफत अर्ज करा.\n" +
            "• **अधिकृत पोर्टल:** [https://pmvishwakarma.gov.in](https://pmvishwakarma.gov.in)",
            "🛠️ **पीएम विश्वकर्मा योजना:**\n\n" +
            "• **लाभ:** 18 पारंपरिक कारीगरों (बढ़ई, लोहार, कुम्हार, दर्जी आदि) को ₹15,000 का टूलकिट अनुदान, ₹500/दिन वजीफे के साथ प्रशिक्षण और 5% ब्याज पर ₹3 लाख तक का लोन।"
        ));

        TOPICS.add(new Topic(
            "pm-surya-ghar",
            new String[]{"surya ghar", "solar rooftop", "muft bijli", "free electricity", "solar subsidy", "सूर्य घर", "सोलर सबसिडी", "मोफत वीज"},
            "☀️ **PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar Subsidy):**\n\n" +
            "• **Benefit:** Up to **300 units of free electricity every month** + Direct bank capital subsidy:\n" +
            "  - **1 kW System:** ₹30,000 subsidy.\n" +
            "  - **2 kW System:** ₹60,000 subsidy.\n" +
            "  - **3 kW System & Above:** **₹78,000 maximum central subsidy**.\n" +
            "• **Eligibility:** Any Indian homeowner with a residential grid-connected electricity connection and adequate shadow-free roof space.\n" +
            "• **How to Apply:**\n" +
            "  1. Register on [https://pmsuryaghar.gov.in](https://pmsuryaghar.gov.in) with consumer electricity account number.\n" +
            "  2. Choose a registered local vendor for installation.\n" +
            "  3. Net-meter inspection by DISCOM (e.g. MSEDCL in Maharashtra) -> Subsidy deposited into bank account within 30 days.",
            "☀️ **पीएम सूर्य घर: मोफत वीज योजना (सोलर रूफटॉप सबसिडी):**\n\n" +
            "• **फायदा:** दरमहा **३०० युनिटपर्यंत मोफत वीज** आणि थेट बँक खात्यात सरकारी सबसिडी:\n" +
            "  - १ किलोवॅट: ₹३०,००० सबसिडी.\n" +
            "  - २ किलोवॅट: ₹६०,००० सबसिडी.\n" +
            "  - ३ किलोवॅट व त्यापुढे: **₹७८,००० थेट सरकारी अनुदान**.\n" +
            "• **अर्ज कसा करावा:** [https://pmsuryaghar.gov.in](https://pmsuryaghar.gov.in) वर महावितरण ग्राहक क्रमांक टाकून नोंदणी करा.",
            "☀️ **पीएम सूर्य घर: मुफ्त बिजली योजना:**\n\n" +
            "• **लाभ:** 300 यूनिट तक मुफ्त बिजली और छत पर सोलर पैनल लगाने के लिए ₹78,000 तक की सरकारी सब्सिडी।\n" +
            "• **आवेदन:** pmsuryaghar.gov.in पर बिजली बिल उपभोक्ता संख्या से आवेदन करें।"
        ));

        TOPICS.add(new Topic(
            "pmay-housing",
            new String[]{"pmay", "awas yojana", "housing subsidy", "gharkul", "घरकुल", "आवास योजना", "घरकुल योजना"},
            "🏡 **Pradhan Mantri Awas Yojana (PMAY Urban & Gramin):**\n\n" +
            "• **Benefit:** Financial assistance and interest subsidies for building or buying a pucca permanent house:\n" +
            "  - **PMAY-Gramin:** ₹1,20,000 (plains) to ₹1,30,000 (hilly areas) direct grant + ₹12,000 for toilet construction under Swachh Bharat + 90 days MGNREGA wages.\n" +
            "  - **PMAY-Urban:** Credit-Linked Subsidy Scheme (CLSS) interest subsidy up to ₹2.67 Lakhs on home loans for EWS/LIG families.\n" +
            "• **Maharashtra State Schemes:** Also check **Ramai Awas Gharkul** (for SC/Neo-Buddhists) and **Shabari Awas Gharkul** (for ST) which provide up to ₹1,42,000 grant.\n" +
            "• **Official Portals:** [https://pmayg.nic.in](https://pmayg.nic.in) and [https://pmayuclap.gov.in](https://pmayuclap.gov.in)",
            "🏡 **प्रधानमंत्री आवास योजना (PMAY) व रमाई घरकुल योजना:**\n\n" +
            "• **फायदा:** पक्के घर बांधण्यासाठी थेट शासकीय अनुदान:\n" +
            "  - **PMAY ग्रामीण:** ₹१,२०,००० थेट बँक खात्यात + स्वच्छ भारत अंतर्गत शौचालयासाठी ₹१२,००० + ९० दिवसांची रोजगार हमी मजुरी.\n" +
            "  - **रमाई आवास घरकुल (महाराष्ट्र):** अनु. जाती व नवबौद्ध घटकांसाठी ₹१,४२,००० पर्यंत विनामूल्य घरकुल अनुदान.\n" +
            "• **पात्रता:** स्वतःचे पक्के घर नसलेले कुटुंब; कच्च्या घरात राहणारे बीपीएल/एसईसीसी लाभार्थी.",
            "🏡 **प्रधानमंत्री आवास योजना (PMAY):**\n\n" +
            "• **लाभ:** पक्का मकान बनाने के लिए ₹1.20 लाख से ₹1.42 लाख तक का सीधा सरकारी अनुदान एवं गृह ऋण पर ब्याज सब्सिडी।"
        ));

        TOPICS.add(new Topic(
            "atal-pension",
            new String[]{"atal pension", "apy", "pension scheme", "अटल पेन्शन", "पेन्शन योजना", "वृद्धापकाळ पेन्शन"},
            "🪙 **Atal Pension Yojana (APY) - Guaranteed Pension for Unorganised Sector:**\n\n" +
            "• **Benefit:** Guaranteed monthly pension of **₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000** for life after attaining 60 years of age, based on chosen contribution.\n" +
            "• **Spouse & Nominee Security:** On subscriber's demise, the same pension is paid to spouse for life; on spouse's demise, the full accumulated corpus (up to ₹8.5 Lakhs) is refunded to nominee.\n" +
            "• **Eligibility:** Any Indian citizen aged **18 to 40 years** holding a savings bank account (Must not be an income taxpayer).\n" +
            "• **How to Join:** Visit your savings bank branch or open instantly via Netbanking / UPI APY registration portal.",
            "🪙 **अटल पेन्शन योजना (APY) - असंघटित कामगारांसाठी हमी पेन्शन:**\n\n" +
            "• **फायदा:** वयाच्या ६० वर्षांनंतर दरमहा **₹१,००० ते ₹५,००० ची खात्रीशीर पेन्शन** आजीवन मिळते.\n" +
            "• **वारसदारास संरक्षण:** पती/पत्नीच्या निधनानंतर पेन्शन जोडीदारास चालू राहते, दोघांनंतर जमा झालेली संपूर्ण रक्कम (८.५ लाखांपर्यंत) मुलास/वारसाला मिळते.\n" +
            "• **पात्रता:** वय १८ ते ४० वर्षे असलेले भारतीय नागरिक; आयकर भरणारे नसावेत.\n" +
            "• **नोंदणी:** कोणत्याही बँकेत जाऊन किंवा नेटबँकिंगद्वारे सुरू करा.",
            "🪙 **अटल पेंशन योजना (APY):**\n\n" +
            "• **लाभ:** 60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 की मासिक गारंटीड आजीवन पेंशन।\n" +
            "• **पात्रता:** 18 से 40 वर्ष की आयु के नागरिक, बचत बैंक खाता धारक।"
        ));

        TOPICS.add(new Topic(
            "sukanya-samriddhi",
            new String[]{"sukanya", "ssy", "girl child scheme", "sukanya samriddhi", "सुकन्या समृद्धी", "मुलींची योजना"},
            "👧 **Sukanya Samriddhi Yojana (SSY) - High Interest Savings for Girl Child:**\n\n" +
            "• **Benefit:** Highest sovereign interest rate among all government small savings schemes (**8.2% per annum** compounded annually) + 100% Tax-Free under Section 80C and EEE status.\n" +
            "• **Eligibility:** Can be opened by parents for any girl child aged **0 to 10 years** (maximum 2 girl children per family).\n" +
            "• **Deposit Limits:** Minimum ₹250 per year up to maximum ₹1,50,000 per financial year.\n" +
            "• **Maturity:** Matures 21 years from account opening or upon girl's marriage after age 18. Partial 50% withdrawal allowed after age 18 for higher college education.\n" +
            "• **Where to Open:** Any Post Office branch or authorized public/private sector bank branch.",
            "👧 **सुकन्या समृद्धी योजना (SSY) - मुलींच्या उज्ज्वल भविष्यासाठी:**\n\n" +
            "• **फायदा:** सर्व सरकारी बचत योजनांमध्ये सर्वाधिक **८.२% वार्षिक व्याज** आणि करमुक्त परतावा (EEE Status).\n" +
            "• **पात्रता:** जन्मापासून ते वयाच्या **१० वर्षांपर्यंतच्या** मुलीच्या नावाने पालक हे खाते उघडू शकतात.\n" +
            "• **गुंतवणूक मर्यादा:** दरवर्षी किमान ₹२५० ते कमाल ₹१,५०,००० पर्यंत.\n" +
            "• **मुदतपूर्ती:** २१ वर्षांनंतर परिपक्व. मुलगी १८ वर्षांची झाल्यावर उच्च शिक्षणासाठी ५०% रक्कम काढण्याची मुभा.\n" +
            "• **खाते कुठे उघडावे:** कोणत्याही पोस्ट ऑफिस किंवा बँकेत जन्म दाखला व आधार कार्ड देऊन.",
            "👧 **सुकन्या समृद्धि योजना (SSY):**\n\n" +
            "• **लाभ:** 8.2% का उच्चतम ब्याज दर, आयकर धारा 80C के तहत पूरी तरह कर-मुक्त।\n" +
            "• **पात्रता:** 10 वर्ष से कम आयु की बालिकाओं के नाम पर डाकघर अथवा बैंक में खाता खुलवाएं।"
        ));

        // ══════════════════════════════════════════════════════════════════════
        // 3. STATUTORY DOCUMENT ACQUISITION MANUALS (RTS ACT 2015)
        // ══════════════════════════════════════════════════════════════════════

        TOPICS.add(new Topic(
            "income-certificate-guide",
            new String[]{"income certificate", "how to get income certificate", "income certificate documents", "उत्पन्नाचा दाखला", "उत्पन्न दाखला कसा काढायचा", "आय प्रमाण पत्र", "आय प्रमाण पत्र कैसे बनाएं"},
            "📜 **How to Officially Get an Income Certificate in Maharashtra (Tahasildar):**\n\n" +
            "• **Issuing Authority:** Tahasildar / Sub-Divisional Officer (Revenue & Forest Department).\n" +
            "• **Validity:** Available as **1-Year Certificate** (Valid for 1 financial year) or **3-Year Certificate** (Ideal for college engineering/medical scholarship cycles).\n" +
            "• **Statutory RTS Timeline:** **15 working days** under Maharashtra Right to Public Services Act 2015.\n" +
            "• **Statutory Government Fee:** ₹33.60 to ₹57.20.\n\n" +
            "**Required Checklists & Supporting Documents:**\n" +
            "  1. Proof of Identity: Aadhaar Card / Voter ID / PAN Card.\n" +
            "  2. Proof of Address: Ration Card / Electricity Bill / Domicile.\n" +
            "  3. Proof of Income:\n" +
            "     - *For Salaried:* Form 16 / Salary Slips of past 3 months / Employer Certificate.\n" +
            "     - *For Farmers:* Talathi Income Verification Report + 7/12 & 8A Extract.\n" +
            "     - *For Business / Laborers:* Self-declaration on ₹100 stamp paper or ITR V acknowledgement.\n\n" +
            "**Step-by-Step Online Application Process:**\n" +
            "  1. Register on Aaple Sarkar: [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in).\n" +
            "  2. Select 'Revenue Department' -> Choose 'Income Certificate'.\n" +
            "  3. Fill family member details and upload scanned copies (JPEG/PDF < 500KB).\n" +
            "  4. Pay nominal RTS fee and download digital acknowledgement receipt with Application Tracking ID.",
            "📜 **महाराष्ट्रात अधिकृत उत्पन्नाचा दाखला कसा काढावा (तहसीलदार कार्यालय):**\n\n" +
            "• **सक्षम अधिकारी:** तहसीलदार / नायब तहसीलदार (महसूल विभाग).\n" +
            "• **मुदत:** १ वर्ष किंवा **३ वर्षांचा दाखला** (विद्यार्थ्यांनी शिष्यवृत्तीसाठी ३ वर्षांचा दाखला काढणे फायदेशीर).\n" +
            "• **लोकसेवा हमी कालावधी:** **१५ कामाचे दिवस** (RTS Act 2015 अंतर्गत).\n" +
            "• **अधिकृत शासकीय फी:** ₹३३.६० ते ₹५७.२०.\n\n" +
            "**आवश्यक कागदपत्रांची यादी:**\n" +
            "  १. ओळख पुरावा: आधार कार्ड किंवा मतदार ओळखपत्र.\n" +
            "  २. पत्त्याचा पुरावा: रेशन कार्ड किंवा लाईट बिल.\n" +
            "  ३. उत्पन्नाचा पुरावा:\n" +
            "     - *शेतकऱ्यांसाठी:* तलाठ्याचा उत्पन्न अहवाल + ७/१२ व ८-अ उतारा.\n" +
            "     - *नोकरदारांसाठी:* फॉर्म १६ किंवा वेतन दाखला (Salary Slip).\n" +
            "     - *मजूर/इतरांसाठी:* स्वयंघोषणापत्र (Self-Declaration).\n\n" +
            "**ऑनलाइन अर्ज कसा करावा:**\n" +
            "  १. आपले सरकार पोर्टलवर जा: [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in).\n" +
            "  २. 'महसूल विभाग' निवडून 'उत्पन्नाचा दाखला' पर्यायावर क्लिक करा.\n" +
            "  ३. माहिती भरा, कागदपत्रे अपलोड करा व अधिकृत फी भरून पोचपावती जतन करा.",
            "📜 **आय प्रमाण पत्र (Income Certificate) कैसे बनवाएं:**\n\n" +
            "• **सक्षम प्राधिकारी:** तहसीलदार (राजस्व विभाग)।\n" +
            "• **समय सीमा:** लोक सेवा गारंटी अधिनियम के तहत 15 कार्य दिवस।\n" +
            "• **दस्तावेज:** आधार कार्ड, राशन कार्ड, तलाठी रिपोर्ट / फॉर्म 16 / वेतन पर्ची।\n" +
            "• **ऑनलाइन पोर्टल:** [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in)"
        ));

        TOPICS.add(new Topic(
            "domicile-certificate-guide",
            new String[]{"domicile", "domicile certificate", "residence certificate", "nationality certificate", "अधिवास", "डोमिसाईल दाखला", "रहिवासी दाखला", "मूल निवास प्रमाण पत्र"},
            "📜 **How to Get Domicile & Nationality Certificate (Maharashtra):**\n\n" +
            "• **Official Purpose:** Proves continuous legal residence in Maharashtra for minimum 15 years. Mandatory for all state quota engineering, medical, government jobs, and welfare benefits.\n" +
            "• **Issuing Authority:** Sub-Divisional Officer (SDO) / Executive Magistrate / Tehsildar.\n" +
            "• **Statutory RTS Timeline:** **15 working days**.\n\n" +
            "**Required Proofs:**\n" +
            "  1. **Continuous 15-Year Residence Proof in Maharashtra:** Any combination of School LC showing place of birth in Maharashtra, 15-year-old Ration Card, Electricity bills, or parent's property tax receipt.\n" +
            "  2. **Proof of Age & Nationality:** School Leaving Certificate (LC) mentioning Indian Nationality, Birth Certificate, or Passport.\n" +
            "  3. **Identity & Address:** Aadhaar Card and Ration Card.\n" +
            "  4. **Self-Declaration Form:** Sworn affidavit declaring continuous stay without holding domicile of any other state.\n\n" +
            "• **Apply Online:** [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in) -> Revenue Services -> Age, Nationality & Domicile Certificate.",
            "📜 **अधिवास व राष्ट्रीयत्व प्रमाणपत्र (Domicile & Nationality) कसे काढावे:**\n\n" +
            "• **महत्त्व:** महाराष्ट्रात सलग १५ वर्षे वास्तव्य असल्याचा अधिकृत पुरावा. सर्व शासकीय नोकऱ्या, महाडीबीटी शिष्यवृत्ती व इंजिनिअरिंग/मेडिकल प्रवेशासाठी बंधनकारक.\n" +
            "• **आवश्यक पुरावे:**\n" +
            "  १. **१५ वर्षे वास्तव्याचा पुरावा:** शाळा सोडल्याचा दाखला (LC), १५ वर्षांपूर्वीचे रेशन कार्ड, लाईट बिल किंवा घरपट्टी पावती.\n" +
            "  २. **ओळख व पत्ता:** आधार कार्ड व रेशन कार्ड.\n" +
            "  ३. **हमीपत्र:** इतर कोणत्याही राज्याचे अधिवास प्रमाणपत्र नसल्याचे प्रतिज्ञापत्र.\n" +
            "• **अर्ज पोर्टल:** आपले सरकार: [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in) (महसूल विभाग -> वय, अधिवास व राष्ट्रीयत्व प्रमाणपत्र).",
            "📜 **अधिवास (डोमिसाइल) प्रमाण पत्र कैसे बनवाएं:**\n\n" +
            "• **उद्देश्य:** राज्य में न्यूनतम 15 वर्षों से निरंतर निवास का प्रमाण।\n" +
            "• **दस्तावेज:** स्कूल लीविंग सर्टिफिकेट (LC), 15 वर्ष पुराना राशन कार्ड/बिजली बिल, आधार कार्ड।\n" +
            "• **पोर्टल:** [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in)"
        ));

        TOPICS.add(new Topic(
            "non-creamy-layer-guide",
            new String[]{"non creamy", "non-creamy layer", "ncl", "obc certificate", "नॉन क्रिमीलेअर", "नॉन क्रिमिलेअर", "एनसीएल"},
            "📜 **How to Get Non-Creamy Layer (NCL) Certificate (Maharashtra):**\n\n" +
            "• **Applicability:** Mandatory for OBC, VJ/NT, and SBC categories to claim reservation quotas in education and employment.\n" +
            "• **Core Criteria:** Gross annual family income of parents must be **less than ₹8,00,000** consecutively for the last 3 financial years.\n" +
            "• **Validity:** Valid for **3 Financial Years** (Check valid up to date printed on the certificate).\n" +
            "• **Required Documents:**\n" +
            "  1. Primary Caste Certificate of applicant or father.\n" +
            "  2. Past 3 consecutive financial years' Income Certificates / Form 16 / ITR.\n" +
            "  3. Proof of Residence (Ration Card / Aadhaar).\n" +
            "  4. Self-declaration that family does not hold constitutional posts or Class-I/II government positions.\n" +
            "• **Apply Online:** [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in) -> Revenue Department -> Non-Creamy Layer Certificate.",
            "📜 **नॉन-क्रिमीलेअर (Non-Creamy Layer - NCL) प्रमाणपत्र कसे काढावे:**\n\n" +
            "• **कोणासाठी आवश्यक:** OBC, VJ/NT आणि SBC प्रवर्गातील विद्यार्थ्यांना आरक्षण व फी सवलतीचा लाभ घेण्यासाठी आवश्यक.\n" +
            "• **मुख्य अट:** पालकांचे मागील सलग ३ आर्थिक वर्षांचे वार्षिक उत्पन्न **₹८ लाखांपेक्षा कमी** असावे.\n" +
            "• **वैधता:** **३ आर्थिक वर्षांसाठी वैध** असते.\n" +
            "• **कागदपत्रे:** जातीचा दाखला, मागील ३ वर्षांचे उत्पन्नाचे दाखले, रेशन कार्ड व आधार कार्ड.\n" +
            "• **पोर्टल:** आपले सरकार: [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in)",
            "📜 **नॉन-क्रीमी लेयर (NCL) प्रमाण पत्र:**\n\n" +
            "• **पात्रता:** OBC/VJNT वर्ग हेतु जिनके माता-पिता की वार्षिक आय पिछले 3 वर्षों से ₹8 लाख से कम हो।\n" +
            "• **दस्तावेज:** जाति प्रमाण पत्र, पिछले 3 वर्षों का आय प्रमाण, आधार कार्ड।"
        ));

        TOPICS.add(new Topic(
            "satbara-712-guide",
            new String[]{"7/12", "satbara", "8a", "ferfar", "land extract", "७/१२", "सातबारा", "८-अ", "खतौनी", "जमीन उतारा"},
            "📜 **How to Download Digital Signed 7/12 & 8A Land Extract (Digital Satbara):**\n\n" +
            "• **What is It:** The 7/12 extract is the official legal land ownership register maintained by the Maharashtra Revenue Department. Digital Satbara bears a valid QR code and 16-digit verification code, legally acceptable in all courts, banks, and scheme scrutiny without Tehsildar physical stamp.\n" +
            "• **Fee:** Nominal ₹15 only per digital download.\n\n" +
            "**Steps to Download in 2 Minutes:**\n" +
            "  1. Go to official portal: [https://digitalsatbara.mahabhumi.gov.in](https://digitalsatbara.mahabhumi.gov.in).\n" +
            "  2. Login with mobile OTP or create a free citizen account.\n" +
            "  3. Select District -> Taluka -> Village -> Enter Survey Number / Gat Number.\n" +
            "  4. Recharge ₹15 via UPI/QR code -> Download digitally signed PDF.\n" +
            "• **For Viewing Free (Unsigned):** Use [https://bhulekh.mahabhumi.gov.in](https://bhulekh.mahabhumi.gov.in).",
            "📜 **डिजिटल स्वाक्षरीत ७/१२ व ८-अ उतारा कसा डाऊनलोड करावा (डिजिटल सातबारा):**\n\n" +
            "• **वैशिष्ट्य:** महाभूमी पोर्टलवरील डिजिटल ७/१२ वर बारकोड व डिजिटल स्वाक्षरी असते, ज्यामुळे तलाठ्याकडे प्रत्यक्ष जाऊन शिक्का मारण्याची गरज उरत नाही. बँका, न्यायालये व योजनांसाठी हा १००% कायदेशीर ग्राह्य आहे.\n" +
            "• **सरकारी फी:** फक्त ₹१५ प्रति उतारा.\n\n" +
            "**डाऊनलोड करण्याची सोपी पद्धत:**\n" +
            "  १. अधिकृत पोर्टलवर जा: [https://digitalsatbara.mahabhumi.gov.in](https://digitalsatbara.mahabhumi.gov.in).\n" +
            "  २. मोबाईल नंबर टाकून OTP ने लॉगिन करा.\n" +
            "  ३. जिल्हा, तालुका, गाव निवडून सर्व्हे नंबर किंवा गट नंबर टाका.\n" +
            "  ४. UPI द्वारे ₹१५ भरा आणि डिजिटल स्वाक्षरीत ७/१२ लगेच डाऊनलोड करा.",
            "📜 **डिजिटल 7/12 और 8-A खतौनी कैसे डाउनलोड करें:**\n\n" +
            "• **पोर्टल:** [https://digitalsatbara.mahabhumi.gov.in](https://digitalsatbara.mahabhumi.gov.in) पर जाएं, ₹15 का ऑनलाइन भुगतान करें और डिजिटल हस्ताक्षरित खतौनी तुरंत डाउनलोड करें।"
        ));

        TOPICS.add(new Topic(
            "udyam-msme-guide",
            new String[]{"udyam", "msme registration", "udyam certificate", "business registration", "उद्यम नोंदणी", "एमएसएमई", "उद्योग आधार"},
            "📜 **Udyam MSME Registration (100% Free Government Certificate):**\n\n" +
            "• **Why it Matters:** Unlocks collateral-free Mudra & CGTMSE loans, 15-35% CMEGP subsidies, ISO reimbursement, priority government tenders, and protection against delayed payments.\n" +
            "• **Cost:** **100% FREE OF COST!** Never pay money on private fake websites ending in .com or .org.\n" +
            "• **Prerequisites:** Only 1) Aadhaar Number, 2) PAN Number (mandatory for proprietary/partnership/company), 3) Bank Account Details.\n\n" +
            "**How to Register Online in 5 Minutes:**\n" +
            "  1. Open verified portal: [https://udyamregistration.gov.in](https://udyamregistration.gov.in).\n" +
            "  2. Click 'For New Entrepreneurs who are not Registered yet as MSME'.\n" +
            "  3. Enter Aadhaar + Name -> Validate OTP.\n" +
            "  4. Enter PAN -> Fill business enterprise name and activity (Manufacturing / Service).\n" +
            "  5. Submit -> Instant Udyam Registration Number & e-Certificate generated!",
            "📜 **उद्यम नोंदणी (Udyam MSME - १००% मोफत शासकीय प्रमाणपत्र):**\n\n" +
            "• **फायदे:** मुद्रा कर्ज, CMEGP सबसिडी, शासकीय निविदांमध्ये प्राधान्य आणि वीज बिलात सवलत.\n" +
            "• **शुल्क:** **पूर्णपणे मोफत (Zero Fee)!** खाजगी बनावट वेबसाइट्सवर पैसे भरू नका.\n" +
            "• **लागणारी कागदपत्रे:** फक्त आधार कार्ड, पॅन कार्ड आणि बँक पासबुक.\n" +
            "• **नोंदणी कशी करावी:** [https://udyamregistration.gov.in](https://udyamregistration.gov.in) वर जाऊन ५ मिनिटांत मोफत सर्टिफिकेट डाऊनलोड करा.",
            "📜 **उद्यम (MSME) रजिस्ट्रेशन प्रक्रिया:**\n\n" +
            "• **फीस:** पूरी तरह निःशुल्क।\n" +
            "• **दस्तावेज:** केवल आधार कार्ड, पैन कार्ड और बैंक खाता।\n" +
            "• **पोर्टल:** [https://udyamregistration.gov.in](https://udyamregistration.gov.in)"
        ));

        TOPICS.add(new Topic(
            "rts-act-guide",
            new String[]{"rts", "right to service", "timeline", "officer delay", "appeal", "लोकसेवा हक्क", "आरपीएस", "अपील"},
            "⚖️ **Maharashtra Right to Public Services Act 2015 (RTS Citizen Guarantee):**\n\n" +
            "• **Statutory Guarantee:** Government departments in Maharashtra are legally obligated to deliver public services (certificates, licenses, land records) within strictly defined deadlines:\n" +
            "  - Income Certificate: **15 working days**.\n" +
            "  - Domicile Certificate: **15 working days**.\n" +
            "  - Non-Creamy Layer: **21 working days**.\n" +
            "  - Caste Certificate: **45 working days**.\n" +
            "• **What if Tehsildar Delays Your Application:**\n" +
            "  1. **First Appeal (Online):** If delayed past deadline, file First Appeal online on Aaple Sarkar to the Sub-Divisional Officer (SDO). SDO must order disposal within 30 days.\n" +
            "  2. **Second Appeal:** To the District Additional Collector.\n" +
            "  3. **Penalty on Defaulting Officers:** The RTS Commission can impose a fine of ₹500 to ₹5,000 on negligent officials, deducted from their salary!\n" +
            "• **RTS Helpline:** 1800-120-8040",
            "⚖️ **महाराष्ट्र लोकसेवा हक्क कायदा २०१५ (नागरिकांचा कायदेशीर अधिकार):**\n\n" +
            "• **हमी कालावधी:** तलाठी व तहसीलदारांना ठराविक मुदतीत दाखला देणे कायद्याने बंधनकारक आहे:\n" +
            "  - उत्पन्नाचा दाखला: **१५ कामाचे दिवस**.\n" +
            "  - अधिवास (डोमिसाईल) दाखला: **१५ कामाचे दिवस**.\n" +
            "  - नॉन-क्रिमीलेअर: **२१ कामाचे दिवस**.\n" +
            "• **अधिकारी उशीर करत असल्यास काय करावे:**\n" +
            "  १. **पहिले अपील (First Appeal):** आपले सरकार पोर्टलवर उपविभागीय अधिकारी (SDO) यांच्याकडे थेट ऑनलाइन अपील दाखल करा.\n" +
            "  २. **दंडात्मक कारवाई:** लोकसेवा आयोगाद्वारे संबंधित कसूरदार अधिकाऱ्यावर ₹५,००० पर्यंत दंडाची तरतूद आहे.\n" +
            "• **हेल्पलाईन:** १८००-१२०-८०४०",
            "⚖️ **महाराष्ट्र लोक सेवा गारंटी अधिनियम 2015:**\n\n" +
            "• सरकारी अधिकारियों को निर्धारित 15 से 21 दिनों में प्रमाणपत्र देना अनिवार्य है। विलंब होने पर आप आपले सरकार पोर्टल पर सीधे प्रथम अपील (First Appeal) दर्ज कर सकते हैं।"
        ));
    }

    public static String findAnswer(String userMessage, boolean isMarathi, boolean isHindi) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return null;
        }

        Topic bestTopic = null;
        int highestScore = 0;

        for (Topic t : TOPICS) {
            int score = t.matchScore(userMessage);
            if (score > highestScore) {
                highestScore = score;
                bestTopic = t;
            }
        }

        // Require at least a reasonable match score
        if (bestTopic != null && highestScore >= 2) {
            if (isMarathi) return bestTopic.answerMr;
            if (isHindi) return bestTopic.answerHi;
            return bestTopic.answerEn;
        }

        return null;
    }
}
