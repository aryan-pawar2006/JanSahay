/**
 * JanSahay Client-Side AI Intelligence Knowledge Base (v2.0 Comprehensive)
 * Offline-first, encyclopedic citizen guidance corpus.
 * Guarantees zero latency and instantaneous, comprehensive answers to all
 * small and big questions about government schemes, documents, application procedures,
 * and the JanSahay AI platform across English, Marathi, and Hindi.
 */

export const TOPICS = [
  // ══════════════════════════════════════════════════════════════════════
  // 1. JANSAHAY APPLICATION & PLATFORM INTELLIGENCE
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'about-jansahay',
    keywords: ['what is jansahay', 'about jansahay', 'about this project', 'who made', 'who created', 'what does this app do', 'what is this website', 'काय आहे', 'क्या है', 'project overview', 'purpose', 'jansahay'],
    en: `🇮🇳 **About JanSahay AI 2.0 (Citizen Scheme & Document Enablement Platform):**

• **Core Mission:** JanSahay AI is an open civic-tech platform designed to eliminate confusion for Indian citizens navigating 40+ Central and State welfare programs.
• **Core Innovations:**
  1. **Deterministic Rule Engine:** Transparently matches age, annual income, caste category, landholding, and domicile with 100% mathematical accuracy—zero hallucinations.
  2. **Cross-Scheme Document Deduplication:** If 4 recommended schemes all require an Income Certificate, JanSahay collapses them into one single action item so you only obtain it once.
  3. **Official Acquisition Guides:** Step-by-step instructions (under the Maharashtra Right to Public Services Act 2015) detailing issuing authorities, statutory fees, and verified portal links.
  4. **Direct Government Application Gateways:** One-click links directly to authorized official portals (MahaDBT, Aaple Sarkar, PM-KISAN, Udyam) without middlemen.
• **Technology:** Built with React 18, Vite, Spring Boot 3 (Java 17), and Aiven MySQL.
• **Service Fee:** 100% Free of charge. JanSahay never asks for money or personal financial details.`,
    mr: `🇮🇳 **जनसहाय AI 2.0 बद्दल माहिती (शासकीय योजना व सहाय्य प्रणाली):**

• **उद्दिष्ट:** भारतातील सर्वसामान्य नागरिक, विद्यार्थी, शेतकरी आणि महिलांना केंद्र व महाराष्ट्र शासनाच्या 40+ योजनांची अचूक माहिती देणे व कागदपत्रे वेळेत पूर्ण करण्यास मदत करणे.
• **प्रमुख वैशिष्ट्ये:**
  १. **अचूक पात्रता तपासणी:** वय, उत्पन्न, जात वर्ग, शेतजमीन व वास्तव्याच्या आधारे नियमांनुसार अचूक निकाल.
  २. **कागदपत्रांची बचत (Deduplication):** ४ योजनांसाठी उत्पन्नाचा दाखला लागत असल्यास, एकच दाखला कसा सर्व ठिकाणी उपयोगी पडेल हे दाखवले जाते.
  ३. **दाखले काढण्याचे मार्गदर्शन:** लोकसेवा हक्क कायदा २०१५ नुसार आवश्यक पुरावे, शुल्क आणि शासकीय कार्यालयांची माहिती.
  ४. **थेट अधिकृत अर्ज:** महाडीबीटी, आपले सरकार, पीएम किसान अशा अधिकृत सरकारी वेबसाइट्सवर थेट अर्ज करण्याची सोय.
• **शुल्क:** जनसहाय AI पूर्णपणे मोफत असून नागरिकांकडून कोणतेही शुल्क आकारले जात नाही.`,
    hi: `🇮🇳 **जनसहाय AI 2.0 के बारे में जानकारी:**

• **उद्देश्य:** भारतीय नागरिकों, छात्रों, किसानों और महिला उद्यमियों को केंद्र व राज्य सरकार की 40+ कल्याणकारी योजनाओं से जोड़ना और आवश्यक दस्तावेजों को तैयार कराना।
• **मुख्य विशेषताएं:**
  1. **सटीक पात्रता जांच:** आपकी आयु, आय, वर्ग और भूमि के आधार पर नियमों के अनुसार सही परिणाम।
  2. **दस्तावेजों का एकीकरण:** कई योजनाओं के लिए लगने वाले समान दस्तावेजों को एक जगह व्यवस्थित करना।
  3. **सरकारी प्रमाणपत्र प्रक्रिया:** आय, जाति, अधिवास आदि प्रमाणपत्र बनवाने के चरण-दर-चरण निर्देश।
  4. **सीधा सरकारी पोर्टल लिंक:** महाडीबीटी, पीएम-किसान, उद्यम आदि आधिकारिक पोर्टलों पर सीधे आवेदन की सुविधा।
• **शुल्क:** शत-प्रतिशत निःशुल्क सेवा।`
  },

  {
    id: 'how-to-use',
    keywords: ['how to use', 'how does it work', 'steps to use', 'how to start', 'how do i use', 'वापर कसा करावा', 'कसा वापरू', 'उपयोग कैसे करें', 'कैसे काम करता है', 'guide'],
    en: `🧭 **How to Use JanSahay AI (Step-by-Step Guide):**

1. **Step 1: Complete Your Citizen Profile Wizard:**
   Click **'Profile'** in the navbar to enter your location, category (Student, Farmer, Business, General Citizen), annual income, and in-hand paperwork.
2. **Step 2: Explore Matched Scheme Recommendations:**
   Visit **'Recommendations'** to view schemes where you meet all statutory conditions, along with transparent pass/fail criteria.
3. **Step 3: Check Document Readiness & Prep Dashboard:**
   Go to **'Document Preparation'** to see missing paperwork, calculate readiness percentages, and view step-by-step acquisition guides.
4. **Step 4: Apply Directly on Official Portals:**
   Click **'Apply Officially on Govt Portal'** on any scheme to submit your application directly on the department's authorized portal.`,
    mr: `🧭 **जनसहाय AI कसे वापरावे (सविस्तर मार्गदर्शक):**

१. **पायरी १: प्रोफाइल विझार्ड पूर्ण करा:** वर 'Profile' वर क्लिक करून तुमचे राज्य, वय, वार्षिक उत्पन्न, व्यवसाय व सध्या हातात असलेली कागदपत्रे निवडा.
२. **पायरी २: शिफारस केलेल्या योजना पहा:** 'Recommendations' टॅबमध्ये तुमच्यासाठी पात्र ठरलेल्या सर्व योजनांची यादी व फायदे पहा.
३. **पायरी ३: कागदपत्रे तयारी डॅशबोर्ड:** 'Document Preparation' मध्ये कोणती कागदपत्रे तयार आहेत व कोणती काढायची आहेत ते तपासा.
४. **पायरी ४: अधिकृत पोर्टलवर अर्ज करा:** 'Apply Officially on Govt Portal' बटणावर क्लिक करून थेट सरकारी वेबसाइटवर अर्ज करा.`,
    hi: `🧭 **जनसहाय AI का उपयोग कैसे करें:**

1. **चरण 1: प्रोफाइल बनाएं:** अपनी आयु, आय, राज्य और वर्तमान दस्तावेजों की जानकारी भरें।
2. **चरण 2: योजनाएं देखें:** 'Recommendations' में अपनी पात्रता के अनुसार योजनाएं और लाभ देखें।
3. **चरण 3: दस्तावेज तैयार करें:** जो दस्तावेज बाकी हैं उन्हें बनवाने की प्रक्रिया समझें।
4. **चरण 4: सीधा आवेदन करें:** आधिकारिक सरकारी पोर्टल पर जाकर ऑनलाइन आवेदन जमा करें।`
  },

  {
    id: 'demo-logins',
    keywords: ['demo account', 'quick login', 'test accounts', 'rahul', 'ramesh', 'priya', 'डेमो खाती', 'लॉगिन कसे करू', 'टेस्ट अकाउंट', 'demo login', 'demo profile', 'how to login with demo', 'instant login'],
    en: `🔑 **JanSahay Quick Demo Personas (Instant 1-Click Login):**

You can test the full functionality immediately using our pre-configured citizen profiles:

• 🎓 **Student Demo (Rahul Patil):**
  - *Profile:* Open category college student, Pune, family income ₹2.5 Lakhs.
  - *Focus Schemes:* EBC Scholarship (50% fee waiver), Dr. Punjabrao Deshmukh Hostel Allowance.
• 🌾 **Farmer Demo (Ramesh Shinde):**
  - *Profile:* Small & marginal farmer, Ahmednagar, 1.8 hectares landholding.
  - *Focus Schemes:* PM-KISAN (₹6,000/yr), Namo Shetkari Mahasanman Nidhi (₹6,000/yr = ₹12,000 total), Magel Tyala Shet Tale.
• 💼 **Business / Women Demo (Priya Deshmukh):**
  - *Profile:* Women entrepreneur, Mumbai, starting a food processing MSME.
  - *Focus Schemes:* Maharashtra Ladki Bahin Yojana (₹1,500/mo), CMEGP (35% subsidy), PMMY Mudra Loan.

💡 *Click any Demo button in the top navigation bar to login with one click!*`,
    mr: `🔑 **जनसहाय इन्स्टंट डेमो प्रोफाइल्स (१-क्लिक लॉगिन):**

• 🎓 **विद्यार्थी डेमो (राहुल पाटील):** ईबीसी शिष्यवृत्ती (५०% फी माफी) आणि पंजाबराव देशमुख वसतिगृह भत्ता.
• 🌾 **शेतकरी डेमो (रमेश शिंदे):** पीएम किसान (₹६,०००) + नमो शेतकरी महासन्मान (₹६,०००) = एकूण ₹१२,००० वार्षिक अनुदान.
• 💼 **महिला / व्यवसाय डेमो (प्रिया देशमुख):** मुख्यमंत्री लाडकी बहीण योजना (₹१,५००/महिना), CMEGP व्यवसाय अनुदान (३५% सबसिडी) आणि मुद्रा कर्ज.

💡 *वर उजव्या बाजूला असलेल्या डेमो बटणावर क्लिक करून थेट लॉगिन करू शकता!*`,
    hi: `🔑 **जनसहाय डेमो खाते (1-क्लिक लॉगिन):**

• 🎓 **छात्र डेमो (राहुल पाटिल):** ईबीसी छात्रवृत्ति और छात्रावास भत्ता।
• 🌾 **किसान डेमो (रमेश शिंदे):** पीएम किसान + नमो शेतकारी योजना।
• 💼 **महिला/उद्यमी डेमो (प्रिया देशमुख):** लाडकी बहिन योजना और मुद्रा लोन।`
  },

  {
    id: 'free-service',
    keywords: ['is it free', 'charges', 'fees', 'cost', 'payment', 'पैसा लागतो का', 'शुल्क', 'पैसे देने पड़ते हैं', 'free or paid'],
    en: `🆓 **JanSahay AI Service Charges & Pricing:**

• **100% Free of Cost:** JanSahay AI is completely free for all citizens of India.
• **No Hidden Fees:** We do not charge for eligibility checking, recommendation generation, AI queries, or viewing document acquisition guides.
• **Statutory Government Fees:** When you apply for official certificates (e.g. Income Certificate or Domicile on Aaple Sarkar), you pay standard statutory government portal fees (typically ₹33 to ₹56) directly to the Government treasury. JanSahay takes ₹0.`,
    mr: `🆓 **जनसहाय AI शुल्क व दर:**

• **१००% मोफत सेवा:** जनसहाय AI सर्व नागरिकांसाठी पूर्णपणे मोफत आहे.
• **कोणतेही छुपा शुल्क नाही:** योजना शोधणे, पात्रता तपासणे आणि दाखल्यांचे मार्गदर्शन मोफत आहे.
• **शासकीय नाममात्र फी:** आपले सरकार पोर्टलवर दाखला काढताना शासनाची अधिकृत फी (सुमारे ₹३३ ते ₹५६) थेट शासनाला द्यावी लागते. जनसहाय कोणतीही फी घेत नाही.`,
    hi: `🆓 **जनसहाय AI शुल्क जानकारी:**

• **100% निःशुल्क सेवा:** यह पोर्टल सभी भारतीय नागरिकों के लिए पूरी तरह मुफ्त है।
• **सरकारी प्रमाणपत्र शुल्क:** जब आप आधिकारिक पोर्टल (जैसे आपले सरकार) पर प्रमाण पत्र बनवाते हैं, तो सरकारी शुल्क (₹33 से ₹56) सीधे सरकार को जाता है। जनसहाय कोई शुल्क नहीं लेता।`
  },

  // ══════════════════════════════════════════════════════════════════════
  // 2. OFFICIAL WEBSITE NAVIGATION SUPPORT
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'official-website-link',
    keywords: ['official website', 'go to official website', 'website not opening', 'apply link not responding', 'website not responding', 'अधिकृत वेबसाइट', 'लिंक उघडत नाही', 'वेबसाइट काम नहीं कर रही'],
    en: `🌐 **Official Government Website Links & Direct Navigation:**

• **How JanSahay Connects to Government Portals:**
  When you click **'Apply Officially on Govt Portal'** or **'Go to Official Website'**, JanSahay opens the verified government departmental portal in a **new browser tab**.
• **Troubleshooting Tips if a Government Portal is Slow:**
  1. Government servers (like MahaDBT, Aaple Sarkar, PM-KISAN) experience high load during peak application seasons. Allow a few seconds for the portal to load.
  2. Ensure your browser is not blocking pop-ups from JanSahay.
  3. Direct Official URLs for Quick Access:
     - **MahaDBT Portal:** [https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in)
     - **Aaple Sarkar Portal:** [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in)
     - **PM-KISAN Portal:** [https://pmkisan.gov.in](https://pmkisan.gov.in)
     - **Mudra Loans (Udyamimitra):** [https://www.udyamimitra.in](https://www.udyamimitra.in)
     - **Ayushman Bharat (PM-JAY):** [https://beneficiary.nha.gov.in](https://beneficiary.nha.gov.in)
     - **PM Vishwakarma:** [https://pmvishwakarma.gov.in](https://pmvishwakarma.gov.in)
     - **PM Surya Ghar:** [https://pmsuryaghar.gov.in](https://pmsuryaghar.gov.in)
     - **Udyam Registration:** [https://udyamregistration.gov.in](https://udyamregistration.gov.in)`,
    mr: `🌐 **अधिकृत शासकीय वेबसाइट्स आणि थेट लिंक मार्गदर्शन:**

• **सरकारी वेबसाइट्सवर थेट अर्ज कसा करावा:**
  जेव्हा तुम्ही 'Apply Officially' किंवा 'Go to Official Website' वर क्लिक करता, तेव्हा अधिकृत सरकारी पोर्टल नवीन टॅबमध्ये उघडते.
• **महत्त्वाच्या थेट वेबसाइट लिंक्स:**
  - **महाडीबीटी शिष्यवृत्ती:** [https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in)
  - **आपले सरकार (दाखले):** [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in)
  - **पीएम किसान सन्मान निधी:** [https://pmkisan.gov.in](https://pmkisan.gov.in)
  - **आयुष्मान भारत कार्ड:** [https://beneficiary.nha.gov.in](https://beneficiary.nha.gov.in)
  - **उद्यम नोंदणी (MSME):** [https://udyamregistration.gov.in](https://udyamregistration.gov.in)`,
    hi: `🌐 **आधिकारिक सरकारी वेबसाइट लिंक:**

• **पोर्टल नेविगेशन सहायता:**
  'Apply Officially' बटन दबाने पर आधिकारिक सरकारी विभाग की वेबसाइट नए टैब में खुलती है।
• **मुख्य आधिकारिक पोर्टल:**
  - महाडीबीटी: [https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in)
  - पीएम किसान: [https://pmkisan.gov.in](https://pmkisan.gov.in)
  - आयुष्मान भारत: [https://beneficiary.nha.gov.in](https://beneficiary.nha.gov.in)`
  },

  // ══════════════════════════════════════════════════════════════════════
  // 3. STUDENT SCHOLARSHIPS (MAHADBT & CENTRAL)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'scheme-ebc',
    keywords: ['ebc scholarship', 'ebc', 'rajarshi shahu maharaj', 'shikshan shulkh', 'fee waiver', 'ईबीसी', 'ईबीसी शिष्यवृत्ती', 'राजर्षि शाहू', '50% fee', 'scholarship for open'],
    en: `🎓 **Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC Scholarship):**

• **Benefit:** 50% Tuition Fee & 50% Exam Fee waiver for Higher & Technical Education (Engineering, Medical, MBA, Polytechnic, Degree colleges).
• **Eligibility Criteria:**
  1. Maharashtra State Domicile.
  2. Admitted through CAP (Centralized Admission Process).
  3. Family Annual Income limit: **Up to ₹8,00,000 (₹8 Lakhs)** from all sources.
  4. Social Category: General / Open / SEBC / EWS category students.
• **Mandatory Documents Required:**
  - Domicile Certificate of Maharashtra.
  - Tahasildar Income Certificate (Valid for current financial year, under ₹8 Lakhs).
  - CAP Allotment Letter & College Admission Fee Receipt.
  - Previous Year Marksheets (HSC / SSC / Diploma / Semester).
  - Aadhaar Card linked to Bank Account (NPCI seeded for DBT).
  - Ration Card (to verify maximum 2 child policy).
• **Where to Apply:** MahaDBT Portal ([https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in)).`,
    mr: `🎓 **राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती योजना (EBC):**

• **लाभ:** उच्च व तंत्रशिक्षण (इंजिनिअरिंग, मेडिकल, फार्मसी, पदवी) च्या शिक्षण शुल्क व परीक्षा शुल्कामध्ये ५०% सूट.
• **पात्रता अटी:**
  १. विद्यार्थी महाराष्ट्राचा रहिवासी (अधिवास/Domicile) असावा.
  २. प्रवेश कॅप (CAP) फेरीतून झालेला असावा.
  ३. कुटुंबाचे वार्षिक उत्पन्न **८ लाख रुपयांच्या आत** असावे.
  ४. प्रवर्ग: खुला (Open), SEBC, EWS.
• **आवश्यक कागदपत्रे:**
  - अधिवास प्रमाणपत्र (Domicile Certificate).
  - सक्षम प्राधिकारी (तहसीलदार) यांचा चालू वर्षाचा उत्पन्नाचा दाखला.
  - कॅप वाटप पत्र (CAP Allotment Letter) व कॉलेज फी पावती.
  - मागील वर्षाची गुणपत्रिका.
  - बँक खात्याशी आधार लिंक (NPCI Seeded).
• **अर्ज कुठे करावा:** महाडीबीटी पोर्टल ([https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in)).`,
    hi: `🎓 **राजर्षि शाहू महाराज ईबीसी (EBC) छात्रवृत्ति योजना:**

• **लाभ:** इंजीनियरिंग, मेडिकल, डिग्री आदि उच्च शिक्षा के शिक्षण शुल्क और परीक्षा शुल्क में 50% की छूट।
• **पात्रता:**
  1. महाराष्ट्र का अधिवास (Domicile)।
  2. कैप (CAP) राउंड से प्रवेश।
  3. पारिवारिक वार्षिक आय ₹8 लाख से कम।
• **आवश्यक दस्तावेज:** अधिवास प्रमाण पत्र, तहसीलदार आय प्रमाण पत्र, कैप अलॉटमेंट लेटर, कॉलेज रसीद और आधार लिंक बैंक खाता।
• **आवेदन पोर्टल:** महाडीबीटी पोर्टल।`
  },

  {
    id: 'scheme-punjabrao',
    keywords: ['punjabrao deshmukh', 'hostel allowance', 'vastigruh', 'hostel bhatta', 'वसतिगृह', 'पंजाबराव देशमुख', 'पंजाबराव वसतिगृह भत्ता'],
    en: `🏠 **Dr. Punjabrao Deshmukh Vastigruh Nirvah Bhatta Yojna (Hostel Allowance):**

• **Benefit:** Cash stipend for lodging and boarding for students residing in hostels or paying guest setups outside their home taluka:
  - **₹30,000/year** for students studying in MMRDA / Pune / Nagpur / Aurangabad metropolitan regions.
  - **₹20,000/year** for other district colleges.
• **Eligibility:**
  1. Children of Registered Small / Marginal Farmers or Registered Laborers.
  2. Annual family income under **₹8,00,000**.
  3. Admitted through CAP rounds and staying in a recognized hostel or rented room.
• **Mandatory Documents:**
  - 7/12 Land Extract or Registered Labor Certificate.
  - Tahasildar Income Certificate.
  - Hostel Warden Certificate or Rent Agreement + Electricity Bill.
  - Maharashtra Domicile Certificate.
• **Where to Apply:** MahaDBT Portal.`,
    mr: `🏠 **डॉ. पंजाबराव देशमुख वसतिगृह निर्वाह भत्ता योजना:**

• **लाभ:** वसतिगृहात राहणाऱ्या विद्यार्थ्यांसाठी भोजन व निवास खर्चासाठी आर्थिक मदत:
  - मुंबई, पुणे, नागपूर, छत्रपती संभाजीनगर अशा महापालिका क्षेत्रांसाठी: **₹३०,००० प्रति वर्ष**.
  - इतर जिल्हा क्षेत्रांसाठी: **₹२०,००० प्रति वर्ष**.
• **पात्रता:** अल्पभूधारक शेतकरी किंवा नोंदणीकृत मजुरांची मुले, उत्पन्न ₹८ लाखांच्या आत, कॅप प्रवेश.
• **आवश्यक कागदपत्रे:** अल्पभूधारक ७/१२ उतारा किंवा मजूर प्रमाणपत्र, उत्पन्नाचा दाखला, वसतिगृह दाखला किंवा भाडेकरार, अधिवास प्रमाणपत्र.`,
    hi: `🏠 **डॉ. पंजाबराव देशमुख छात्रावास भत्ता योजना:**

• **लाभ:** महानगरों में पढ़ने वाले छात्रों को ₹30,000/वर्ष और अन्य जिलों में ₹20,000/वर्ष छात्रावास व भोजन भत्ता।
• **पात्रता:** अल्पभूधारक किसान अथवा मजदूर परिवार के बच्चे, आय ₹8 लाख तक।
• **आवेदन:** महाडीबीटी पोर्टल।`
  },

  {
    id: 'scheme-post-matric-scst',
    keywords: ['post matric sc st', 'sc scholarship', 'st scholarship', 'social justice', 'मागासवर्गीय शिष्यवृत्ती', 'अनुसूचित जाती शिष्यवृत्ती', 'tribal scholarship'],
    en: `🎓 **Post Matric Scholarship for SC / ST Students (Maharashtra Social Justice & Tribal Dept):**

• **Benefit:** 100% Tuition & Exam fee reimbursement plus monthly maintenance allowance directly credited to bank account.
• **Eligibility:**
  - SC students: Family income up to ₹2,50,000/year (Government of India Post Matric Scholarship).
  - ST students: Tribal Development Department criteria.
• **Mandatory Documents:**
  - Caste Certificate & Caste Validity Certificate.
  - Income Certificate (Issued by Tahasildar).
  - Domicile Certificate of Maharashtra.
  - Previous marksheets & college fee receipt.
  - Aadhaar seeded bank passbook.
• **Where to Apply:** MahaDBT Portal ([https://mahadbt.maharashtra.gov.in](https://mahadbt.maharashtra.gov.in)).`,
    mr: `🎓 **अनुसूचित जाती / जमाती (SC/ST) मॅट्रिकोत्तर शिष्यवृत्ती:**

• **लाभ:** १००% शिक्षण शुल्क व परीक्षा फी माफी + मासिक निर्वाह भत्ता थेट बँक खात्यात.
• **पात्रता:** अनुसूचित जाती व जमातीचे विद्यार्थी, उत्पन्न मर्यादा ₹२.५ लाखांपर्यंत (शासकीय नियमांनुसार).
• **कागदपत्रे:** जात प्रमाणपत्र, जात पडताळणी (Caste Validity), उत्पन्नाचा दाखला, अधिवास, आधार लिंक बँक खाते.`,
    hi: `🎓 **एससी/एसटी उत्तर मैट्रिक छात्रवृत्ति योजना:**

• **लाभ:** 100% कॉलेज फीस माफी एवं मासिक भत्ता।
• **दस्तावेज:** जाति प्रमाण पत्र, जाति वैधता (Caste Validity), आय प्रमाण पत्र, अधिवास एवं आधार सीडेड बैंक खाता।`
  },

  {
    id: 'scheme-nsp',
    keywords: ['nsp', 'national scholarship portal', 'central sector scholarship', 'minority scholarship', 'केन्द्रीय छात्रवृत्ति', 'एनएसपी'],
    en: `🏛️ **National Scholarship Portal (NSP) — Central Schemes:**

• **Overview:** Single unified gateway for Government of India schemes including Central Sector Scheme of Scholarship for College and University Students, Post-Matric Scholarships for Minorities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi), and Divyangjan students.
• **Benefits:** ₹10,000 to ₹20,000 per annum credited via DBT.
• **Eligibility:** 80th percentile in Class 12 (for Central Sector) and family income up to ₹4.5 Lakhs (up to ₹2.5 Lakhs for minority post-matric).
• **Official Portal:** [https://scholarships.gov.in](https://scholarships.gov.in).`,
    mr: `🏛️ **राष्ट्रीय शिष्यवृत्ती पोर्टल (NSP) - केंद्र शासन योजना:**

• **माहिती:** भारत सरकारच्या उच्च शिक्षण, अल्पसंख्याक आणि दिव्यांग विद्यार्थ्यांसाठीचे अधिकृत पोर्टल.
• **लाभ:** ₹१०,००० ते ₹२०,००० प्रति वर्ष थेट बँक खात्यात.
• **पोर्टल:** [https://scholarships.gov.in](https://scholarships.gov.in).`,
    hi: `🏛️ **नेशनल स्कॉलरशिप पोर्टल (NSP):**

• **विवरण:** केंद्र सरकार की छात्रवृत्तियों (अल्पसंख्यक, दिव्यांग, उच्च शिक्षा) के लिए आधिकारिक पोर्टल।
• **पोर्टल:** [https://scholarships.gov.in](https://scholarships.gov.in)।`
  },

  // ══════════════════════════════════════════════════════════════════════
  // 4. FARMER & AGRICULTURE WELFARE SCHEMES
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'scheme-pm-kisan',
    keywords: ['pm kisan', 'pm-kisan', 'kisan samman nidhi', '6000', 'farmer 6000', 'पीएम किसान', 'शेतकरी ६०००', 'किसान सम्मान निधि', 'kisan payment'],
    en: `🌾 **Pradhan Mantri Kisan Samman Nidhi (PM-KISAN):**

• **Benefit:** ₹6,000 per year provided to landholding farmer families in 3 equal four-monthly installments of ₹2,000 directly into Aadhaar-linked bank accounts via DBT.
• **Combined Maharashtra Benefit:** Combined with **Namo Shetkari Mahasanman Nidhi (₹6,000/yr)**, Maharashtra farmers receive a total of **₹12,000 per year**!
• **Eligibility Criteria:**
  1. Farmer must hold cultivable agricultural land registered in their name in State land records.
  2. Mandatory Prerequisites: Active e-KYC on PM-KISAN portal, Land Seeding verification on Mahabhumi, and NPCI Aadhaar bank seeding.
  3. Exclusions: Institutional landholders, constitutional post holders, income tax payers, retired pensioners receiving ₹10,000+/month.
• **Where to Apply & Check Status:** [https://pmkisan.gov.in](https://pmkisan.gov.in).`,
    mr: `🌾 **प्रधानमंत्री किसान सन्मान निधी (PM-KISAN):**

• **लाभ:** शेतकरी कुटुंबांना दरवर्षी ₹६,००० चे थेट आर्थिक सहाय्य (₹२,००० चे ३ समान हप्ते).
• **महाराष्ट्रातील विशेष लाभ:** महाराष्ट्र शासनाची **नमो शेतकरी महासन्मान निधी योजना (₹६,०००)** मिळून राज्यातील शेतकऱ्यांना **एकूण ₹१२,००० प्रति वर्ष** मिळतात!
• **पात्रता अटी:**
  १. स्वतःच्या नावावर शेतजमीन असलेला सातबारा (८-अ उतारा).
  २. पीएम-किसान पोर्टलवर बायोमेट्रिक किंवा ओटीपी द्वारे e-KYC पूर्ण असणे आवश्यक.
  ३. बँक खात्याशी आधार संलग्न (Aadhaar NPCI Seeding) असणे आवश्यक.
• **अधिकृत पोर्टल:** [https://pmkisan.gov.in](https://pmkisan.gov.in).`,
    hi: `🌾 **प्रधानमंत्री किसान सम्मान निधि (PM-KISAN):**

• **लाभ:** पात्र किसान परिवारों को प्रति वर्ष ₹6,000 (₹2,000 की 3 किस्तें) डीबीटी द्वारा बैंक खाते में।
• **महाराष्ट्र का लाभ:** नमो शेतकरी योजना (₹6,000) मिलाकर महाराष्ट्र के किसानों को कुल ₹12,000 सालाना मिलते हैं।
• **अनिवार्य शर्तें:** भू-अभिलेख (खतौनी), पोर्टल पर e-KYC और बैंक खाते में आधार NPCI सीडिंग।
• **पोर्टल:** [https://pmkisan.gov.in](https://pmkisan.gov.in)।`
  },

  {
    id: 'scheme-namo-shetkari',
    keywords: ['namo shetkari', 'namo kisan', 'mahasanman nidhi', '12000', 'नमो शेतकरी', 'नमो शेतकरी योजना', 'महाराष्ट्र शेतकरी अनुदान'],
    en: `🌾 **Namo Shetkari Mahasanman Nidhi Yojana (Government of Maharashtra):**

• **Benefit:** Additional ₹6,000/year funded by Maharashtra State Government, disbursed alongside PM-KISAN, giving Maharashtra farmers **₹12,000 total annually**.
• **Automatic Enrollment:** Every farmer in Maharashtra who successfully receives PM-KISAN is automatically registered for Namo Shetkari—no separate form needed!
• **Prerequisites:** Valid land title, e-KYC completed on PM-KISAN, Aadhaar bank account mapped on NPCI gateway.`,
    mr: `🌾 **नमो शेतकरी महासन्मान निधी योजना (महाराष्ट्र शासन):**

• **लाभ:** महाराष्ट्र शासनाकडून शेतकऱ्यांना दरवर्षी अतिरिक्त ₹६,००० चे अनुदान (PM-KISAN सोबत एकूण ₹१२,०००).
• **नोंदणी:** ज्या शेतकऱ्यांना PM-KISAN चे हप्ते मिळतात, त्यांना आपोआप नमो शेतकरी योजनेचा लाभ मिळतो; वेगळा अर्ज करण्याची गरज नसते.
• **अटी:** सातबारा नोंद, e-KYC व आधार-बँक लिंकिंग पूर्ण असणे अनिवार्य.`,
    hi: `🌾 **नमो शेतकारी महासम्मान निधि योजना (महाराष्ट्र):**

• **लाभ:** महाराष्ट्र सरकार द्वारा ₹6,000 प्रति वर्ष की अतिरिक्त राशि (पीएम किसान के ₹6,000 मिलाकर कुल ₹12,000)।
• **पात्रता:** पीएम-किसान के सभी सत्यापित लाभार्थी किसान।`
  },

  {
    id: 'scheme-pmfby',
    keywords: ['pmfby', 'fasal bima', 'crop insurance', 'pik vima', 'एक रुपयात पीक विमा', 'पीक विमा', 'फसल बीमा'],
    en: `🌧️ **Pradhan Mantri Fasal Bima Yojana (PMFBY / 1 Rupee Pik Vima Maharashtra):**

• **Benefit:** Comprehensive crop insurance against localized calamities, drought, floods, pest attacks, and post-harvest losses.
• **Maharashtra Special Benefit:** Maharashtra farmers pay only **₹1 nominal premium** per application, with remaining premium borne by the State and Central Government.
• **Documents:** 7/12 & 8-A extract, sowing declaration certificate (Pik Pahani on e-Pik Pahani App), Aadhaar card, bank passbook.
• **Official Portal:** [https://pmfby.gov.in](https://pmfby.gov.in).`,
    mr: `🌧️ **१ रुपयात पीक विमा योजना (PMFBY महाराष्ट्र):**

• **लाभ:** दुष्काळ, अतिवृष्टी, कीड व नैसर्गिक आपत्तीमुळे पिकांचे नुकसान झाल्यास संपूर्ण भरपाई.
• **खास वैशिष्ट्य:** शेतकऱ्याला केवळ **₹१ नाममात्र शुल्क** भरावे लागते, उर्वरित सर्व हप्ता शासन भरते.
• **कागदपत्रे:** डिजिटल ७/१२ व ८-अ, ई-पीक पाहणी नोंद, आधार कार्ड व बँक पासबूक.
• **पोर्टल:** [https://pmfby.gov.in](https://pmfby.gov.in).`,
    hi: `🌧️ **प्रधानमंत्री फसल बीमा योजना (PMFBY):**

• **लाभ:** फसलों को प्राकृतिक आपदा, सूखा या बाढ़ से होने वाले नुकसान पर आर्थिक सुरक्षा (महाराष्ट्र में सिर्फ ₹1 में)।
• **पोर्टल:** [https://pmfby.gov.in](https://pmfby.gov.in)।`
  },

  // ══════════════════════════════════════════════════════════════════════
  // 5. WOMEN & SOCIAL WELFARE SCHEMES
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'scheme-ladki-bahin',
    keywords: ['ladki bahin', 'majhi ladki bahin', '1500', 'mukhyamantri ladki bahin', 'लाडकी बहीण', 'मुख्यमंत्री माझी लाडकी बहीण', 'ladli behna maharashtra', 'women 1500'],
    en: `🌸 **Mukhyamantri Majhi Ladki Bahin Yojana (Government of Maharashtra):**

• **Benefit:** **₹1,500 per month** (₹18,000 per year) directly credited to eligible women beneficiaries' bank accounts via Aadhaar DBT.
• **Eligibility Criteria:**
  1. Permanent Resident & Domicile of Maharashtra State.
  2. Women aged between **21 and 65 years**.
  3. Family Annual Income under **₹2,50,000 (₹2.5 Lakhs)**.
  4. (Exemption): Yellow or Orange Ration Card holders are exempted from submitting a separate Tahasildar Income Certificate.
• **Mandatory Documents Required:**
  - Aadhaar Card of the woman.
  - Maharashtra Domicile Certificate (or School Leaving Certificate / Voter ID showing Maharashtra birth).
  - Yellow / Orange Ration Card OR Tahasildar Income Certificate under ₹2.5 Lakhs.
  - Bank Account linked to Aadhaar (NPCI DBT active).
  - Passport photo & Hamipatra (Self-declaration form).
• **Where to Apply:** Nari Shakti Doot Mobile App or Aaple Sarkar Seva Kendra (Setu Kendra).`,
    mr: `🌸 **मुख्यमंत्री माझी लाडकी बहीण योजना (महाराष्ट्र शासन):**

• **लाभ:** पात्र महिलांना दरमहा **₹१,५००** (वार्षिक ₹१८,०००) थेट बँक खात्यात डीबीटीद्वारे.
• **पात्रता अटी:**
  १. महिला महाराष्ट्राची रहिवासी असावी.
  २. वय **२१ ते ६५ वर्षे**.
  ३. कुटुंबाचे वार्षिक उत्पन्न **₹२,५०,००० च्या आत** असावे.
  ४. (सूट): पिवळे किंवा केशरी रेशनकार्ड असल्यास स्वतंत्र उत्पन्नाच्या दाखल्याची आवश्यकता नाही!
• **आवश्यक कागदपत्रे:**
  - महिलेचे आधार कार्ड.
  - अधिवास प्रमाणपत्र (किंवा शाळा सोडल्याचा दाखला / जन्म दाखला / मतदार ओळखपत्र).
  - केशरी किंवा पिवळे रेशनकार्ड किंवा उत्पन्नाचा दाखला.
  - आधार लिंक बँक खाते (डीबीटी सुरू असलेले).
  - हमीपत्र (स्वयंघोषणा पत्र).
• **अर्ज कसा करावा:** नारी शक्ती दूत ॲप किंवा जवळच्या सेतू / आपले सरकार केंद्रात.`,
    hi: `🌸 **मुख्यमंत्री माझी लाडकी बहिन योजना:**

• **लाभ:** 21 से 65 वर्ष की पात्र महिलाओं को ₹1,500 प्रतिमाह (वार्षिक ₹18,000) बैंक खाते में।
• **पात्रता:** महाराष्ट्र निवासी, वार्षिक आय ₹2.5 लाख से कम। पीला/नारंगी राशन कार्ड होने पर आय प्रमाण पत्र की आवश्यकता नहीं।
• **दस्तावेज:** आधार कार्ड, अधिवास, राशन कार्ड और आधार लिंक बैंक खाता।`
  },

  {
    id: 'scheme-sukanya-samriddhi',
    keywords: ['sukanya samriddhi', 'ssy', 'girl child scheme', 'sukanya', 'सुकन्या समृद्धी', 'सुकन्या समृद्धी योजना', 'बेटी बचाओ'],
    en: `👧 **Sukanya Samriddhi Yojana (SSY):**

• **Benefit:** High government-guaranteed interest rate (currently **8.2% p.a.** compounded annually) for girl children, with triple tax exemption under Section 80C (EEE status).
• **Account Opening:** Can be opened at any Post Office or authorized commercial bank for a girl child from birth up to 10 years of age.
• **Deposit Rules:** Minimum ₹250 to maximum ₹1,50,000 per financial year for 15 years.
• **Maturity:** Account matures when the girl turns 21 or gets married after 18. Partial withdrawal up to 50% allowed after age 18 for higher education.
• **Documents:** Birth Certificate of girl child, Aadhaar & PAN of parent/guardian, proof of address, photos.`,
    mr: `👧 **सुकन्या समृद्धी योजना (SSY):**

• **लाभ:** मुलींच्या भविष्यासाठी सर्वाधिक शासकीय व्याजदर (**८.२% वार्षिक**) आणि कलम 80C अंतर्गत संपूर्ण करमाफी.
• **खाते:** मुलगी जन्मापासून १० वर्षे वयाची होईपर्यंत पोस्ट ऑफिस किंवा बँकेत खाते उघडता येते.
• **रक्कम:** वर्षाला किमान ₹२५० ते कमाल ₹१.५ लाख जमा करता येतात.
• **मुदत:** मुलगी २१ वर्षांची झाल्यावर संपूर्ण रक्कम व्याजासह मिळते (१८ व्या वर्षानंतर शिक्षणासाठी ५०% काढता येतात).
• **कागदपत्रे:** मुलीचा जन्म दाखला, पालकांचे आधार व पॅन कार्ड, पत्त्याचा पुरावा.`,
    hi: `👧 **सुकन्या समृद्धि योजना (SSY):**

• **लाभ:** बेटियों के लिए 8.2% की दर से सुरक्षित ब्याज एवं टैक्स छूट।
• **खाता:** 0 से 10 वर्ष की बालिका हेतु डाकघर या बैंक में न्यूनतम ₹250 से खाता खोलें।`
  },

  // ══════════════════════════════════════════════════════════════════════
  // 6. BUSINESS, STARTUPS & LOAN SUBSIDIES
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'scheme-mudra',
    keywords: ['mudra loan', 'pmmy', 'shishu', 'kishore', 'tarun', 'collateral free loan', 'मुद्रा कर्ज', 'मुद्रा लोन', 'बिजनेस लोन', 'business loan without collateral'],
    en: `💼 **Pradhan Mantri Mudra Yojana (PMMY):**

• **Benefit:** Collateral-free business loans up to **₹20 Lakhs** for micro, small enterprises and non-corporate small businesses.
• **Three Categories:**
  1. **Shishu:** Loans up to **₹50,000** (for starting a new small business).
  2. **Kishore:** Loans from **₹50,001 up to ₹5,00,000** (for business expansion / equipment).
  3. **Tarun & Tarun Plus:** Loans from **₹5,00,000 up to ₹20,00,000** (for established business growth).
• **Security / Collateral:** **Zero collateral required** (backed by Credit Guarantee Fund for Micro Units).
• **Where to Apply:** Any commercial bank, RRB, NBFC or directly through Udyamimitra portal ([https://www.udyamimitra.in](https://www.udyamimitra.in)).`,
    mr: `💼 **प्रधानमंत्री मुद्रा योजना (PMMY - विनातारण कर्ज):**

• **लाभ:** सूक्ष्म व लघू उद्योगांसाठी **२० लाख रुपयांपर्यंत विनातारण (Collateral-free)** कर्ज.
• **तीन प्रमुख प्रकार:**
  १. **शिशू (Shishu):** ₹५०,००० पर्यंत (नवीन छोट्या व्यवसायासाठी).
  २. **किशोर (Kishore):** ₹५०,००१ ते ₹५,००,००० पर्यंत (व्यवसाय वाढ व यंत्रसामग्री).
  ३. **तरुण (Tarun):** ₹५,००,००० ते ₹२०,००,००० पर्यंत (मोठ्या विस्तारासाठी).
• **हमी:** कोणत्याही तारण किंवा हमीची गरज नाही.
• **अर्ज कुठे करावा:** कोणत्याही बँकेत किंवा उद्यमीमित्र पोर्टलवर ([https://www.udyamimitra.in](https://www.udyamimitra.in)).`,
    hi: `💼 **प्रधानमंत्री मुद्रा योजना (PMMY):**

• **लाभ:** छोटे व्यवसायों के लिए ₹20 लाख तक का बिना गारंटी का लोन।
• **श्रेणियां:** शिशु (₹50,000 तक), किशोर (₹50 हजार से 5 लाख तक), तरुण (₹5 लाख से 20 लाख तक)।
• **आवेदन:** बैंक शाखा या उद्यमीमित्र पोर्टल।`
  },

  {
    id: 'scheme-cmegp',
    keywords: ['cmegp', 'chief minister employment', 'maharashtra subsidy', '35% subsidy', 'सीएमईजीपी', 'मुख्यमंत्री रोजगार निर्मिती', 'उद्योग सबसिडी', 'cmegp loan'],
    en: `🏭 **Chief Minister Employment Generation Programme (CMEGP - Maharashtra):**

• **Benefit:** Subsidized bank-linked project financing up to **₹50 Lakhs** for manufacturing units and **₹20 Lakhs** for service enterprises.
• **Government Capital Subsidy:**
  - **15% to 25%** for General category applicants.
  - **25% to 35%** for Women, SC, ST, OBC, Ex-servicemen, and Minorities.
• **Eligibility:** Age 18 to 45 years (up to 50 for reserved/women), minimum 7th pass (for projects >₹10L), Maharashtra Domicile.
• **Where to Apply:** Official CMEGP Portal ([https://maha-cmegp.gov.in](https://maha-cmegp.gov.in)).`,
    mr: `🏭 **मुख्यमंत्री रोजगार निर्मिती कार्यक्रम (CMEGP महाराष्ट्र):**

• **लाभ:** उत्पादन उद्योगासाठी **₹५० लाखांपर्यंत** आणि सेवा उद्योगासाठी **₹२० लाखांपर्यंत** प्रकल्प कर्ज.
• **शासकीय अनुदान (सबसिडी):**
  - खुला प्रवर्ग: १५% ते २५% सबसिडी.
  - महिला, SC, ST, OBC, अल्पसंख्याक: **२५% ते ३५% सबसिडी**!
• **पात्रता:** वय १८ ते ४५ वर्षे (मागासवर्गीय/महिलांना ५० पर्यंत), किमान ७ वी उत्तीर्ण, महाराष्ट्राचा रहिवासी.
• **अधिकृत पोर्टल:** [https://maha-cmegp.gov.in](https://maha-cmegp.gov.in).`,
    hi: `🏭 **मुख्यमंत्री रोजगार सृजन कार्यक्रम (CMEGP महाराष्ट्र):**

• **लाभ:** निर्माण हेतु ₹50 लाख एवं सेवा व्यवसाय हेतु ₹20 लाख तक लोन, साथ में 25% से 35% तक सरकारी सब्सिडी।
• **आवेदन:** महा-सीएमईजीपी पोर्टल।`
  },

  {
    id: 'scheme-vishwakarma',
    keywords: ['vishwakarma', 'pm vishwakarma', 'artisan', 'toolkit', '15000 toolkit', 'विश्वकर्मा', 'पीएम विश्वकर्मा', 'कारागीर योजना', 'artisan loan'],
    en: `⚒️ **PM Vishwakarma Scheme:**

• **Benefit:** Comprehensive support for 18 traditional trade artisans (Carpenters, Blacksmiths, Potters, Cobblers, Tailors, Masons, etc.):
  1. Free PM Vishwakarma Certificate & ID Card.
  2. Free 5-7 days skill training with ₹500/day stipend.
  3. **₹15,000 Free Modern Toolkit Grant** (e-voucher).
  4. Collateral-free enterprise loans: **₹1,00,000 (Tranche 1)** and **₹2,00,000 (Tranche 2)** at concessional 5% interest rate.
• **Where to Apply:** Nearest CSC (Common Service Center) or [https://pmvishwakarma.gov.in](https://pmvishwakarma.gov.in).`,
    mr: `⚒️ **पीएम विश्वकर्मा योजना (पारंपारिक १८ कारागिरांसाठी):**

• **लाभ:** सुतार, लोहार, कुंभार, चांभार, शिंपी, गवंडी अशा १८ पारंपारिक व्यावसायिकांना:
  १. अधिकृत विश्वकर्मा प्रमाणपत्र व ओळखपत्र.
  २. मोफत कौशल्य प्रशिक्षण + ₹५०० प्रतिदिन विद्यावेतन.
  ३. **₹१५,००० चे मोफत आधुनिक टूलकिट अनुदान** (ई-व्हाउचर).
  ४. ५% सवलतीच्या व्याजदरात ₹१ लाख ते ₹२ लाखांपर्यंत विनातारण कर्ज.
• **अर्ज कुठे करावा:** जवळच्या सीएससी (CSC) केंद्रात किंवा पोर्टलवर.`,
    hi: `⚒️ **पीएम विश्वकर्मा योजना:**

• **लाभ:** 18 पारंपरिक कारीगरों को ₹15,000 का मुफ्त टूलकिट वाउचर, 5% ब्याज पर ₹3 लाख तक का लोन और प्रमाण पत्र।
• **आवेदन:** जन सेवा केंद्र (CSC)।`
  },

  {
    id: 'scheme-surya-ghar',
    keywords: ['surya ghar', 'solar rooftop', 'solar subsidy', '78000', 'solar panel', 'सूर्य घर', 'सौर ऊर्जा', 'सोलर सबसिडी', 'free electricity'],
    en: `☀️ **PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar Subsidy):**

• **Benefit:** Up to 300 units of free monthly electricity and direct Central Government capital subsidy:
  - **₹30,000** for 1 kW rooftop solar system.
  - **₹60,000** for 2 kW systems.
  - **₹78,000** for 3 kW and higher systems.
• **Eligibility:** Residential electricity consumer with an active meter in their name and suitable shadow-free rooftop space.
• **Where to Apply:** National Portal for Rooftop Solar ([https://pmsuryaghar.gov.in](https://pmsuryaghar.gov.in)).`,
    mr: `☀️ **पीएम सूर्य घर: मोफत वीज योजना (सोलर सबसिडी):**

• **लाभ:** दरमहा ३०० युनिटपर्यंत मोफत वीज आणि खात्यात थेट शासकीय सबसिडी:
  - १ किलोवॅटसाठी: **₹३०,००० सबसिडी**.
  - २ किलोवॅटसाठी: **₹६०,००० सबसिडी**.
  - ३ किलोवॅट व अधिकसाठी: **₹७८,००० थेट सबसिडी**.
• **पात्रता:** स्वतःच्या नावावर घरगुती वीज मीटर आणि छतावर पुरेशी जागा.
• **अधिकृत पोर्टल:** [https://pmsuryaghar.gov.in](https://pmsuryaghar.gov.in).`,
    hi: `☀️ **पीएम सूर्य घर मुफ्त बिजली योजना:**

• **लाभ:** हर माह 300 यूनिट मुफ्त बिजली और 3kW रूफटॉप सोलर लगाने पर ₹78,000 तक की डायरेक्ट सब्सिडी।
• **पोर्टल:** [https://pmsuryaghar.gov.in](https://pmsuryaghar.gov.in)।`
  },

  {
    id: 'scheme-ayushman',
    keywords: ['ayushman bharat', 'pmjay', 'golden card', '5 lakh treatment', 'health insurance', 'आयुष्मान भारत', 'गोल्डन कार्ड', '५ लाख मोफत उपचार', 'महात्मा फुले जन आरोग्य'],
    en: `🏥 **Ayushman Bharat (PM-JAY) & Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY):**

• **Benefit:** **₹5,00,000 (₹5 Lakhs)** cashless medical treatment per family per year across 27,000+ empaneled government and private network hospitals nationwide.
• **Coverage:** Includes secondary and tertiary care hospitalizations, surgeries, ICU, implants, diagnostics, and medications.
• **Eligibility in Maharashtra:** Extended under universal MJPJAY to all ration card holders (Yellow, Orange, and White card families).
• **How to Get Card:** Visit any Empaneled Hospital Ayushman Mitra desk or generate Ayushman Golden Card at [https://beneficiary.nha.gov.in](https://beneficiary.nha.gov.in).`,
    mr: `🏥 **आयुष्मान भारत (PM-JAY) व महात्मा फुले जन आरोग्य योजना (MJPJAY):**

• **लाभ:** प्रति कुटुंब दरवर्षी **₹५ लाखांपर्यंत मोफत व कॅशलेस उपचार** (शस्त्रक्रिया, औषधे, तपासण्या).
• **व्याप्ती:** महाराष्ट्रातील सर्व पिवळे, केशरी व पांढरे रेशनकार्ड धारक कुटुंबे पात्र!
• **कार्ड कसे काढावे:** जवळच्या शासकीय किंवा नोंदणीकृत खाजगी रुग्णालयातील 'आयुष्मान मित्र' कक्षात किंवा [https://beneficiary.nha.gov.in](https://beneficiary.nha.gov.in) वर.`,
    hi: `🏥 **आयुष्मान भारत (PM-JAY):**

• **लाभ:** प्रति वर्ष ₹5 लाख तक का कैशलेस इलाज देशभर के सूचीबद्ध अस्पतालों में।
• **कार्ड बनवाएं:** [https://beneficiary.nha.gov.in](https://beneficiary.nha.gov.in)।`
  },

  {
    id: 'scheme-pmay',
    keywords: ['pmay', 'pradhan mantri awas', 'housing subsidy', 'gharkul', 'home loan subsidy', 'घरकुल', 'पंतप्रधान आवास योजना', 'घरकुल योजना', 'ramai awas'],
    en: `🏠 **Pradhan Mantri Awas Yojana (PMAY Urban / Gramin & Ramai Awas):**

• **Benefit:** Financial assistance of **₹1.2 Lakh to ₹2.5 Lakhs** for pucca house construction or Credit-Linked Interest Subsidy on home loans up to ₹2.67 Lakhs.
• **Eligibility:** Homeless families or those living in kutcha / dilapidated houses; must not own a pucca house anywhere in India.
• **Categories:** EWS (Income up to ₹3L), LIG (Income up to ₹6L), MIG. Women co-ownership is mandatory for PMAY-U.
• **Official Portal:** [https://pmaymis.gov.in](https://pmaymis.gov.in).`,
    mr: `🏠 **प्रधानमंत्री आवास योजना (PMAY) व रमाई आवास घरकुल योजना:**

• **लाभ:** पक्के घर बांधण्यासाठी **₹१.२० लाख ते ₹२.५० लाखांचे आर्थिक सहाय्य** किंवा गृहकर्जावर व्याज सबसिडी.
• **पात्रता:** भारतात कुठेही स्वतःचे पक्के घर नसलेले नागरिक, कच्च्या घरात राहणारे कुटुंब.
• **कागदपत्रे:** जागेचा ७/१२ किंवा नमुना ८ नमुना पुरावा, उत्पन्नाचा दाखला, आधार कार्ड, बँक खाते.`,
    hi: `🏠 **प्रधानमंत्री आवास योजना (PMAY):**

• **लाभ:** पक्का मकान बनाने के लिए ₹1.20 लाख से ₹2.5 लाख तक की आर्थिक सहायता।`
  },

  {
    id: 'scheme-atal-pension',
    keywords: ['atal pension', 'apy', 'pension scheme', 'pension 5000', 'अटल पेन्शन', 'पेन्शन योजना', 'old age pension'],
    en: `🪙 **Atal Pension Yojana (APY):**

• **Benefit:** Guaranteed monthly pension of **₹1,000, ₹2,000, ₹3,000, ₹4,000 or ₹5,000** starting at age 60, depending on contribution amount.
• **Eligibility:** Any Indian citizen aged between **18 and 40 years** with a bank account. Must not be an income taxpayer.
• **Key Feature:** Same pension continues to spouse upon subscriber's demise; 100% pension corpus returned to nominee.`,
    mr: `🪙 **अटल पेन्शन योजना (APY):**

• **लाभ:** वयाच्या ६० वर्षानंतर दरमहा **₹१,००० ते ₹५,००० हमीभाव निवृत्तीवेतन** (पेन्शन).
• **पात्रता:** वय १८ ते ४० वर्षे असलेला कोणताही भारतीय नागरिक ज्याचे बँक खाते आहे.
• **अर्ज:** कोणत्याही बँकेत किंवा पोस्ट ऑफिसमध्ये बचत खात्याद्वारे.`,
    hi: `🪙 **अटल पेंशन योजना (APY):**

• **लाभ:** 60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 प्रतिमाह गारंटीड पेंशन।`
  },

  // ══════════════════════════════════════════════════════════════════════
  // 7. STATUTORY DOCUMENT ACQUISITION GUIDES (RTS ACT 2015)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'guide-income',
    keywords: ['income certificate', 'tahasildar income', 'utpannacha dakhla', 'get income certificate', 'उत्पन्नाचा दाखला', 'तहसीलदार दाखला', 'आय प्रमाण पत्र', 'income proof'],
    en: `📜 **Step-by-Step Guide: How to Obtain Tahasildar Income Certificate:**

• **Issuing Authority:** Tahasildar / Sub-Divisional Officer (SDO) via Revenue Department, Maharashtra.
• **Statutory Delivery Timeline:** **15 Days** (Right to Public Services Act 2015).
• **Official Statutory Fee:** ₹33.60 on portal; ₹56 at CSC / Aaple Sarkar Seva Kendra.
• **Required Proofs & Documents:**
  1. **Identity Proof:** Aadhaar Card / Voter ID / PAN Card.
  2. **Address Proof:** Ration Card / Electricity Bill / Domicile.
  3. **Age Proof:** School Leaving Certificate or Birth Certificate.
  4. **Income Proof (Mandatory):**
     - For Farmers: Talathi Income Verification Report + 7/12 & 8-A Extract.
     - For Salaried: Form 16 / Salary Slips of last 3 months + Employer Certificate.
     - For Business/Self-Employed: ITR Acknowledgement or Self-declaration Affidavit.
• **How to Apply:** Online at [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in) or visit nearest Setu / Maha e-Seva Kendra.`,
    mr: `📜 **तहसीलदार उत्पन्नाचा दाखला काढण्याची सोपी पद्धत:**

• **सक्षम अधिकारी:** तहसीलदार / नायब तहसीलदार (महसूल विभाग).
• **वेळ मर्यादा:** **१५ दिवस** (महाराष्ट्र लोकसेवा हक्क कायदा २०१५ नुसार).
• **अधिकृत फी:** पोर्टलवर ₹३३.६०; सेतू केंद्रात ₹५६.
• **लागणारी कागदपत्रे:**
  १. **ओळखीचा पुरावा:** आधार कार्ड किंवा मतदार ओळखपत्र.
  २. **पत्त्याचा पुरावा:** रेशनकार्ड किंवा लाईट बिल.
  ३. **उत्पन्नाचा पुरावा:** तलाठी अहवाल (शेतकऱ्यांसाठी) किंवा फॉर्म १६ / पगार पावती / स्वयंघोषणा पत्र.
• **अर्ज कुठे करावा:** आपले सरकार पोर्टल ([https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in)) किंवा सेतू केंद्र.`,
    hi: `📜 **तहसीलदार आय प्रमाण पत्र कैसे बनवाएं:**

• **समय सीमा:** 15 दिन (आरटीएस एक्ट)।
• **आवश्यक दस्तावेज:** आधार कार्ड, राशन कार्ड, तलाठी रिपोर्ट या वेतन पर्ची/आईटीआर।
• **पोर्टल:** [https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in)।`
  },

  {
    id: 'guide-domicile',
    keywords: ['domicile certificate', 'residence certificate', 'adhivas pramanpatra', 'how to get domicile', 'रहिवासी दाखला', 'अधिवास दाखला', 'अधिवास प्रमाणपत्र', 'मूल निवास प्रमाण पत्र'],
    en: `📑 **Step-by-Step Guide: How to Obtain Maharashtra Domicile & Nationality Certificate:**

• **Statutory Rule:** Continuous residence of at least **15 years** in Maharashtra is mandatory.
• **Delivery Timeline:** **15 Days** under RTS Act 2015.
• **Required Proofs:**
  1. Residence Proof for 15 Years: Ration cards, electricity bills, or school certificates spanning 15 years.
  2. School Leaving Certificate showing birthplace within Maharashtra.
  3. Birth Certificate of applicant.
  4. Aadhaar Card & 2 Passport-sized photographs.
• **Where to Apply:** Aaple Sarkar Portal under Revenue Department -> Age, Nationality & Domicile Certificate.`,
    mr: `📑 **महाराष्ट्र अधिवास व राष्ट्रीयत्व प्रमाणपत्र (Domicile Certificate):**

• **महत्त्वाची अट:** महाराष्ट्रात सलग **१५ वर्षे वास्तव्य** असणे बंधनकारक.
• **वेळ मर्यादा:** १५ दिवस.
• **आवश्यक पुरावे:**
  १. १५ वर्षे वास्तव्याचा पुरावा (रेशनकार्ड, जुनी लाईट बिले, घराचा कर पावती).
  २. शाळा सोडल्याचा दाखला (LC) ज्यावर जन्मठिकाण नोंद आहे.
  ३. जन्म नोंदणी दाखला व आधार कार्ड.
• **अर्ज पोर्टल:** आपले सरकार ([https://aaplesarkar.mahaonline.gov.in](https://aaplesarkar.mahaonline.gov.in)).`,
    hi: `📑 **मूल निवास (Domicile) प्रमाण पत्र प्रक्रिया:**

• **नियम:** राज्य में 15 वर्ष का निरंतर निवास।
• **दस्तावेज:** 15 वर्षों के निवास प्रमाण (राशन कार्ड/बिजली बिल), स्कूल लीविंग सर्टिफिकेट और आधार कार्ड।`
  },

  {
    id: 'guide-caste',
    keywords: ['caste certificate', 'caste validity', 'barti', 'ccvis', 'जात प्रमाणपत्र', 'जात पडताळणी', 'जाति प्रमाण पत्र', 'caste verification'],
    en: `📜 **Caste Certificate & Caste Validity Verification Guide:**

• **1. Caste Certificate (Revenue Dept):**
  - Proves candidate belongs to SC, ST, VJNT, OBC, or SBC category.
  - Requires pre-1967 (for SC/OBC) or pre-1950 (for SC) historical family records, father/grandfather's school leaving certificate with caste mentioned.
• **2. Caste Validity Certificate (CCVIS / Barti / TRTI):**
  - **Mandatory for:** Professional college admissions (CAP rounds for Engineering, MBBS), government job appointments, and elections.
  - Apply online via CCVIS portal ([https://ccvis.mahaonline.gov.in](https://ccvis.mahaonline.gov.in)) with genealogical family tree (Vamshaval) and original revenue caste certificate.`,
    mr: `📜 **जात प्रमाणपत्र व जात पडताळणी (Caste Validity):**

• **१. जात दाखला:** उपविभागीय अधिकारी (SDO) यांच्याकडून मिळतो. यासाठी वडील किंवा आजोबांचा शाळा सोडल्याचा दाखला ज्यावर जात नोंद आहे तो लागतो.
• **२. जात पडताळणी प्रमाणपत्र (Validity):** इंजिनिअरिंग, मेडिकल व सरकारी नोकरीसाठी अनिवार्य. बार्टी/CCVIS पोर्टलवर वंशावळ प्रतिज्ञापत्र जोडून अर्ज करावा लागतो.`,
    hi: `📜 **जाति प्रमाण पत्र एवं जाति वैधता (Caste Validity):**

• **महत्व:** उच्च शिक्षा व सरकारी नौकरियों में आरक्षण हेतु अनिवार्य। बार्टी पोर्टल पर वंशावली के साथ आवेदन करें।`
  },

  {
    id: 'guide-ncl',
    keywords: ['non creamy layer', 'ncl certificate', 'ncl validity', 'नॉन क्रिमिलेअर', 'उन्नत व प्रगत गट', 'non-creamy layer', 'obc ncl'],
    en: `📄 **Non-Creamy Layer Certificate (NCL) Guide:**

• **Who Needs It:** OBC, VJNT, and SBC category citizens to claim reservation benefits in scholarships, higher education admissions, and government recruitment.
• **Income Ceiling:** Family gross annual income must be **under ₹8,00,000 (₹8 Lakhs)** for each of the last 3 preceding financial years.
• **Validity:** Usually issued with a **3-year validity** (must cover the ongoing financial year).
• **Where to Apply:** Aaple Sarkar Portal under Revenue Department -> Non-Creamy Layer Certificate.`,
    mr: `📄 **नॉन-क्रिमिलेअर प्रमाणपत्र (NCL):**

• **कोणासाठी:** OBC, VJNT आणि SBC प्रवर्गातील विद्यार्थ्यांना शिष्यवृत्ती व प्रवेश आरक्षणासाठी आवश्यक.
• **उत्पन्न मर्यादा:** सलग मागील ३ वर्षांचे सरासरी वार्षिक उत्पन्न **₹८ लाखांच्या आत** असावे.
• **वैधता:** ३ वर्षांसाठी वैध असते.
• **अर्ज:** आपले सरकार पोर्टलवर महसूल विभागामार्फत.`,
    hi: `📄 **नॉन-क्रीमी लेयर प्रमाण पत्र (NCL):**

• **पात्रता:** ओबीसी/वीजेएनटी श्रेणी, पिछले 3 वर्षों की पारिवारिक आय ₹8 लाख से कम। 3 वर्ष हेतु मान्य।`
  },

  {
    id: 'guide-satbara',
    keywords: ['7/12', 'satbara', '8a', 'digital 7/12', 'mahabhumi', 'land record', 'सातबारा', '८-अ', 'डिजिटल सातबारा', 'खतौनी', 'भूलेख'],
    en: `🌾 **How to Download Digitally Signed 7/12 & 8-A Extract (Mahabhumi):**

• **Official Website:** [https://digitalsatbara.mahabhumi.gov.in](https://digitalsatbara.mahabhumi.gov.in)
• **Legal Standing:** Digitally signed extracts with a QR code and 16-digit ULPIN are 100% legally valid across all banks, courts, and government portals without needing a manual stamp or signature from the Talathi.
• **Statutory Cost:** ₹15 per download from your online balance.
• **Steps:**
  1. Register on Digital Satbara portal with your mobile number.
  2. Select District, Taluka, Village, and Survey / Gat Number.
  3. Download the PDF with digital cryptographic signature.`,
    mr: `🌾 **डिजिटल स्वाक्षरीत ७/१२ व ८-अ उतारा कसा काढावा:**

• **अधिकृत पोर्टल:** [https://digitalsatbara.mahabhumi.gov.in](https://digitalsatbara.mahabhumi.gov.in)
• **कायदेशीर मान्यता:** यावरील क्यूआर कोड आणि डिजिटल सहीमुळे तलाठ्याच्या सही-शिक्क्याची गरज नसते; सर्व बँका व न्यायालयांत कायदेशीर ग्राह्य धरला जातो.
• **शुल्क:** अवघे ₹१५ प्रति उतारा.
• **पद्धत:** महाभूमी पोर्टलवर जाऊन जिल्हा, तालुका, गाव आणि गट नंबर टाकून थेट डाउनलोड करा.`,
    hi: `🌾 **डिजिटल 7/12 खसरा-खतौनी कैसे निकालें:**

• **पोर्टल:** [https://digitalsatbara.mahabhumi.gov.in](https://digitalsatbara.mahabhumi.gov.in)। डिजिटल हस्ताक्षर युक्त सातबारा कानूनी रूप से मान्य है।`
  },

  {
    id: 'guide-udyam',
    keywords: ['udyam registration', 'msme certificate', 'udyam certificate', 'उद्यम नोंदणी', 'उद्योग आधार', 'msme registration free', 'udyam'],
    en: `🏭 **Udyam MSME Registration (100% Free):**

• **Official Portal:** [https://udyamregistration.gov.in](https://udyamregistration.gov.in) (Strictly Government portal, Beware of fake sites charging ₹1,500-₹3,000!).
• **Statutory Fee:** **₹0 (Completely Free of Cost)**.
• **Requirements:**
  1. Aadhaar Card of Proprietor / Director / Partner (mobile OTP verification required).
  2. PAN Card of business or individual.
  3. Bank account details and business address.
• **Benefits:** Eligible for priority sector lending, lower interest rates on Mudra / CMEGP / PMEGP, 50% patent discount, and exemption on security deposits in government tenders.`,
    mr: `🏭 **उद्यम नोंदणी (MSME उद्योग आधार):**

• **अधिकृत पोर्टल:** [https://udyamregistration.gov.in](https://udyamregistration.gov.in) (१००% मोफत, कोणत्याही दलालाला पैसे देऊ नका!).
• **आवश्यक बाबी:** मालकाचे आधार कार्ड (ओटीपी लिंक), पॅन कार्ड, बँक तपशील व व्यवसायाचा पत्ता.
• **फायदे:** मुद्रा, CMEGP योजनांमध्ये प्राधान्य, कमी व्याजदरात कर्ज व शासकीय निविदांमध्ये सवलत.`,
    hi: `🏭 **उद्यम पंजीकरण (MSME रजिस्ट्रेशन):**

• **पोर्टल:** [https://udyamregistration.gov.in](https://udyamregistration.gov.in) (पूर्णतः निःशुल्क)।
• **आवश्यकता:** आधार, पैन एवं बैंक खाता विवरण।`
  },

  {
    id: 'guide-rts',
    keywords: ['rts act', 'right to services', 'statutory timeline', 'complaint for delay', 'लोकसेवा हक्क कायदा', 'दाखला उशिरा मिळाला', 'rts maharashtra'],
    en: `⚖️ **Maharashtra Right to Public Services Act 2015 (RTS Act):**

• **Citizen's Legal Right:** Guarantees transparent, timely, and hassle-free delivery of 500+ government services within statutory timelines.
• **Key Statutory Deadlines:**
  - Income Certificate: **15 Days**
  - Domicile Certificate: **15 Days**
  - Caste Certificate: **45 Days**
  - Non-Creamy Layer: **21 Days**
  - 7/12 & 8A Extract: **Instant / 1 Day**
• **What if delayed?** Citizens have the right to file an online First Appeal directly on Aaple Sarkar portal to the Senior Appellate Officer against unreasonable departmental delay.`,
    mr: `⚖️ **महाराष्ट्र लोकसेवा हक्क कायदा २०१५ (RTS Act):**

• **नागरिकांचा कायदेशीर हक्क:** शासकीय सेवा विहित मुदतीत मिळणे हा प्रत्येक नागरिकाचा कायदेशीर हक्क आहे.
• **वैधानिक मुदत:** उत्पन्नाचा दाखला (१५ दिवस), अधिवास (१५ दिवस), जात दाखला (४५ दिवस), नॉन-क्रिमिलेअर (२१ दिवस).
• **वेळेत न मिळाल्यास:** आपले सरकार पोर्टलवर 'प्रथम अपील' दाखल करून जबाबदार अधिकाऱ्याविरुद्ध तक्रार नोंदवता येते.`,
    hi: `⚖️ **लोकसेवा गारंटी अधिनियम (RTS Act):**

• **अधिकार:** निश्चित समय सीमा (आय प्रमाण पत्र: 15 दिन) में सरकारी सेवाएं प्राप्त करने का कानूनी अधिकार। देरी होने पर प्रथम अपील दर्ज करें।`
  },

  // ══════════════════════════════════════════════════════════════════════
  // 8. CITIZEN TROUBLESHOOTING & NPCI DBT BANK SEEDING
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'troubleshoot-npci',
    keywords: ['npci', 'dbt', 'bank linking', 'aadhaar seeding', 'subsidy not received', 'payment failure', 'डीबीटी', 'आधार लिंक', 'बँक खाते आधार लिंक', 'पैसे आले नाहीत', 'scholarship not credited'],
    en: `🏦 **NPCI Aadhaar Seeding & DBT Bank Account Activation Guide:**

• **The #1 Reason Scheme Money / Scholarships Fail:**
  Simply linking Aadhaar to your bank for KYC is **NOT enough**. Your bank account must be actively **seeded on the NPCI (National Payments Corporation of India) Aadhaar Payment Bridge (APB) mapper**.
• **How to Verify Your Status in 1 Minute:**
  1. Visit the UIDAI MyAadhaar Portal ([https://myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in)).
  2. Click **'Bank Seeding Status'** and log in with your Aadhaar + OTP.
  3. Verify that status displays **'Active'** along with your bank name.
• **How to Fix if Inactive:**
  Submit a physical **'Aadhaar Mandate & NPCI Seeding Consent Form'** at your bank branch, or enable it via your bank's mobile banking app.`,
    mr: `🏦 **बँक खात्याशी आधार NPCI सीलिंग (DBT सुरू करण्याची पद्धत):**

• **अनुदान किंवा शिष्यवृत्ती न मिळण्याचे मुख्य कारण:**
  केवळ बँकेत आधार देणे पुरेसे नाही; ते खाते **NPCI मॅपरवर संलग्न (Seeded)** असणे बंधनकारक आहे.
• **स्थिती कशी तपासावी:**
  १. [https://myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in) वर जा.
  २. **'Bank Seeding Status'** वर क्लिक करून आधार नंबर व ओटीपी टाका.
  ३. स्थिती 'Active' दाखवत असल्याची खात्री करा.
• **बँकेत सुरू कसे करावे:** बँकेत जाऊन 'NPCI DBT Seeding Form' भरून द्या किंवा मोबाईल बँकिंगद्वारे DBT चालू करा.`,
    hi: `🏦 **एनपीसीआई (NPCI) आधार सीडिंग व डीबीटी समस्या निवारण:**

• **पैसा न आने का कारण:** बैंक खाता एनपीसीआई मैपर पर डीबीटी हेतु सक्रिय न होना।
• **जांच:** [https://myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in) पर 'Bank Seeding Status' जांचें। अपनी शाखा में आधार मैंडेट फॉर्म जमा करें।`
  },

  {
    id: 'troubleshoot-otp',
    keywords: ['otp issue', 'mobile number change', 'aadhaar otp not coming', 'ओटीपी येत नाही', 'मोबाईल नंबर बदल', 'otp समस्या'],
    en: `📱 **Aadhaar Mobile OTP Troubleshooting:**

• **Problem:** Not receiving OTP for online verification on MahaDBT, Aaple Sarkar, or PM-KISAN.
• **Solution:**
  1. Verify which mobile number is linked: Check on UIDAI portal ([https://myaadhaar.uidai.gov.in/verify-email-mobile](https://myaadhaar.uidai.gov.in/verify-email-mobile)).
  2. If the linked SIM is inactive or lost, visit the nearest Aadhaar Seva Kendra or Post Office with your Aadhaar to update your mobile number via biometric thumb verification (takes 24-48 hours).`,
    mr: `📱 **आधार ओटीपी (OTP) येत नसल्यास काय करावे:**

१. [https://myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in) वर जाऊन कोणता नंबर लिंक आहे ते तपासा.
२. जुना नंबर बंद असल्यास जवळच्या आधार सेवा केंद्र किंवा पोस्ट ऑफिसमध्ये जाऊन बायोमेट्रिकद्वारे नवीन नंबर लिंक करा (२४ ते ४८ तासांत सुरू होतो).`,
    hi: `📱 **आधार ओटीपी समस्या समाधान:**

• यदि आधार से लिंक मोबाइल नंबर बंद है, तो नजदीकी डाकघर या आधार सेवा केंद्र जाकर नया नंबर अपडेट करवाएं।`
  },

  // ══════════════════════════════════════════════════════════════════════
  // 9. HELPLINES & EMERGENCY GOVERNMENT DIRECTORY
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'helplines',
    keywords: ['helpline', 'contact', 'customer care', 'phone number', 'toll free', 'हेल्पलाईन', 'संपर्क नंबर', 'फोन नंबर', 'helpdesk', 'emergency number'],
    en: `📞 **Official Government Helplines & Contact Directory:**

• **Maharashtra CM Helpline (Toll-Free 24x7):** 1800-120-8040
• **PM-KISAN Helpline:** 155261 / 1800-115526
• **Kisan Call Center (Agriculture Advisory):** 1800-180-1551
• **Ayushman Bharat (Health Treatment):** 14555
• **MahaDBT Technical Helpline:** 022-49150800
• **Women Helpline (Domestic Abuse / Harassment):** 181 / 1091
• **Child Helpline:** 1098
• **Senior Citizen Helpline:** 14567
• **National Cyber Crime Reporting:** 1930`,
    mr: `📞 **अधिकृत शासकीय हेल्पलाईन व संपर्क क्रमांक:**

• **मुख्यमंत्री हेल्पलाईन (महाराष्ट्र शासन):** १८००-१२०-८०४० (२४ तास विनामूल्य)
• **पीएम किसान हेल्पलाईन:** १५५२६१ / १८००-११५५२६
• **किसान कॉल सेंटर (शेतकरी सल्ला):** १८००-१८०-१५५१
• **आयुष्मान भारत (आरोग्य उपचार):** १४५५५
• **महाडीबीटी शिष्यवृत्ती सपोर्ट:** ०२२-४९१५०८००
• **महिला सहाय्यता हेल्पलाईन:** १०९१ / १८१
• **सायबर क्राईम तक्रार:** १९३०`,
    hi: `📞 **प्रमुख सरकारी हेल्पलाइन नंबर:**

• **सीएम हेल्पलाइन (महाराष्ट्र):** 1800-120-8040
• **पीएम किसान:** 155261 / 1800-115526
• **आयुष्मान भारत:** 14555
• **महिला हेल्पलाइन:** 1091
• **साइबर हेल्पलाइन:** 1930`
  }
];

/**
 * Intelligent client-side matcher that finds encyclopedic answers instantly.
 */
export const searchKnowledgeBase = (query, schemeContext = null, language = 'en') => {
  if (!query || typeof query !== 'string') return null;
  const lower = query.toLowerCase().trim();

  // 1. If asking about the current scheme explicitly
  if (schemeContext && (lower.includes('this scheme') || lower.includes('या योजने') || lower.includes('is yojana') || lower.includes('about scheme'))) {
    const sName = schemeContext.name || schemeContext.schemeName;
    const sBenefit = schemeContext.benefit;
    const sDesc = schemeContext.description;
    const sSource = schemeContext.sourceUrl;

    if (language === 'mr') {
      return `ℹ️ **${sName} बद्दल सविस्तर माहिती:**\n\n${sDesc || ''}\n\n🎁 **थेट लाभ:** ${sBenefit || 'शासकीय नियमांनुसार'}\n\n🌐 **अधिकृत पोर्टल:** ${sSource || 'शासकीय पोर्टल'}\n\nतुम्ही मला या योजनेसाठी लागणारी कागदपत्रे, पात्रता अटी किंवा अर्ज करण्याची पद्धत विचारू शकता!`;
    }
    return `ℹ️ **Detailed Information for ${sName}:**\n\n${sDesc || ''}\n\n🎁 **Direct Benefit:** ${sBenefit || 'As per government guidelines'}\n\n🌐 **Official Application Portal:** [${sSource}](${sSource})\n\nFeel free to ask me what documents you need, how to apply, or whether you qualify!`;
  }

  // 2. Score match against offline encyclopedic topics
  let bestTopic = null;
  let highestScore = 0;

  for (const t of TOPICS) {
    let score = 0;
    for (const kw of t.keywords) {
      const kwLower = kw.toLowerCase();
      if (lower.includes(kwLower)) {
        score += kwLower.length > 5 ? 4 : 2;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestTopic = t;
    }
  }

  if (bestTopic && highestScore >= 2) {
    if (language === 'mr' || lower.includes('मराठी') || lower.includes('सांगा') || lower.includes('आहे')) {
      return bestTopic.mr || bestTopic.en;
    }
    if (language === 'hi' || lower.includes('हिंदी') || lower.includes('बताइए') || lower.includes('क्या')) {
      return bestTopic.hi || bestTopic.en;
    }
    return bestTopic.en;
  }

  return null;
};

export const POPULAR_PROMPT_PILLS = [
  { label: '🏛️ What is JanSahay AI?', query: 'What is JanSahay AI and how does it work?' },
  { label: '🎓 EBC Scholarship (50% Fee)', query: 'Tell me all about Rajarshi Shahu Maharaj EBC Scholarship criteria and documents' },
  { label: '🌾 PM-KISAN + Namo (₹12,000)', query: 'How do farmers get ₹12,000 from PM-KISAN and Namo Shetkari?' },
  { label: '🌸 Ladki Bahin (₹1,500/mo)', query: 'What are the rules and documents for Mukhyamantri Majhi Ladki Bahin Yojana?' },
  { label: '💼 Mudra Loan (Collateral-Free)', query: 'How to get Mudra loan without collateral and what are the categories?' },
  { label: '🏥 Ayushman Bharat (₹5 Lakh)', query: 'How to get Ayushman Bharat Golden Card for ₹5 Lakh free treatment?' },
  { label: '⚒️ PM Vishwakarma (₹15,000 Tool)', query: 'What are the benefits and toolkit grant in PM Vishwakarma scheme?' },
  { label: '☀️ PM Surya Ghar (Solar Subsidy)', query: 'How to get ₹78,000 solar subsidy under PM Surya Ghar Muft Bijli Yojana?' },
  { label: '📜 Get Income Certificate', query: 'How to get Tahasildar Income Certificate step by step under RTS Act?' },
  { label: '📑 Get Domicile Certificate', query: 'What documents are required for Maharashtra Domicile Certificate?' },
  { label: '🌾 Digital 7/12 (Satbara)', query: 'How to download digitally signed 7/12 extract on Mahabhumi?' },
  { label: '🏦 NPCI Bank Seeding for DBT', query: 'How to link bank account with NPCI mapper for DBT payments?' },
  { label: '🌐 Official Website Links', query: 'How to open official government portals and apply directly?' },
  { label: '📞 Emergency Helplines', query: 'What are the official government helpline numbers?' }
];
