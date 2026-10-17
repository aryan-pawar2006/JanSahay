# 🇮🇳 JANSAHAY AI 2.0
## Smart Government Scheme Discovery & Document Guidance System

> **College Mini-Project Subject Submission & Comprehensive Presentation Guide**  
> **Tagline:** *"Discover. Understand. Prepare. Apply."*

---

## 1. Project Overview & One-Line Pitch

> **One-Line Idea:** *"Tell the application about your situation, and JanSahay AI shows government support, documents, eligibility explanations, and next steps that may be relevant to you."*

Citizens across India frequently miss out on critical government benefits, subsidies, and scholarships because:
1. Information is scattered across hundreds of departmental portals.
2. Official eligibility conditions are written in complex legalistic terminology.
3. Citizens do not know what documents are required or how to obtain missing certificates (e.g., Tehsildar Income Certificate, Domicile, Non-Creamy Layer, 7/12 Extract, Udyam MSME).

**JanSahay AI** solves this by offering an end-to-end civic journey:
$$\text{Citizen Profile} \longrightarrow \text{Deterministic Rule Matching} \longrightarrow \text{Document Checklist} \longrightarrow \text{State Acquisition Guides} \longrightarrow \text{Grounded Multilingual AI}$$

---

## 2. Live Application Access

The application is running and accessible immediately:

| Service | Local URL | Description |
| :--- | :--- | :--- |
| **Frontend Portal** | [http://localhost:5173](http://localhost:5173) | Responsive React citizen interface |
| **Backend REST API** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Node.js + Express API engine |
| **Schemes Catalog API** | [http://localhost:5000/api/schemes](http://localhost:5000/api/schemes) | Central & State schemes endpoint |
| **Document Guides API** | [http://localhost:5000/api/documents/guides](http://localhost:5000/api/documents/guides) | State document acquisition guides |

---

## 3. Pre-Configured Test Credentials (1-Click Demo)

The login page includes **1-click quick-login buttons** designed for academic viva evaluation:

| Profile | Credentials | Context / Use Case |
| :--- | :--- | :--- |
| 👨‍🎓 **Student** | `student@jansahay.ai` / `Student@123` | Undergrad B.Tech Student, Pune, Maharashtra (Income &lt; ₹2 Lakh) |
| 🌾 **Farmer** | `farmer@jansahay.ai` / `Farmer@123` | Cultivator with 3.5 acres, Satara, Maharashtra (Sugarcane/Soybean) |
| 💼 **Business** | `business@jansahay.ai` / `Business@123` | Agro-processing Startup Entrepreneur, Mumbai (MSME Registered) |
| 🛡️ **Administrator** | `admin@jansahay.gov.in` / `Admin@123` | Knowledge base manager (Verify/publish document guides) |

---

## 4. Key Features Implemented

### 1. Smart Progressive Citizen Profile
- Asks questions progressively based on the selected category (**Student**, **Farmer**, **Business Owner**, **Job Seeker**, **General Citizen**).
- **Data Minimization:** Strictly avoids asking for or storing Aadhaar numbers, bank account numbers, or government passwords.

### 2. Deterministic Eligibility Rule Engine
- **Core Principle:** AI does **NOT** decide legal eligibility. A transparent, auditable rule engine evaluates mathematical and relational criteria (`EQUALS`, `NOT_EQUALS`, `IN`, `GREATER_THAN`, `LESS_THAN`).
- **Match Tiers:**
  - 🟢 **Strong Match** ($\ge 80\%$ criteria met, all mandatory conditions satisfied)
  - 🟡 **Potential Match** ($\ge 50\%$ criteria met)
  - 🔵 **More Information Required** (Unrecorded profile fields)
  - 🔴 **Not a Match** (Failed a mandatory prerequisite)
- Explains **why** a scheme matched by listing satisfied conditions, failed criteria, and missing fields.

### 3. Integrated 3-Section Scheme Experience
When opening any recommended scheme:
- **Section A: Scheme Eligibility** (matched rules breakdown, target beneficiaries, income ceiling)
- **Section B: Required Documents Checklist** (live status: Available, Missing, Needs Verification, Unknown)
- **Section C: How to Obtain Missing Documents** (guidance cards with 1-click acquisition modals)

### 4. Smart Document Acquisition Guides
Complete manuals explaining how citizens can obtain certificates without paying unofficial agents:
1. **Income Certificate (उत्पन्नाचा दाखला)** — Revenue Dept / Tehsildar (Aaple Sarkar)
2. **Domicile & Nationality Certificate (अधिवास दाखला)** — Executive Magistrate
3. **Caste Certificate (जातीचे प्रमाणपत्र)** — Sub-Divisional Officer (SDO)
4. **Non-Creamy Layer Certificate (नॉन-क्रिमीलेअर)** — Revenue Dept
5. **7/12 & 8A Land Extract (सातबारा उतारा)** — Mahabhumi Digital Portal
6. **Udyam MSME Registration (उद्यम नोंदणी)** — Ministry of MSME
7. **College Bonafide Certificate** — University / Institute Registrar
8. **UDID Disability Certificate (दिव्यांग प्रमाणपत्र)** — Swavlamban Portal / District Hospital
9. **Caste Validity Certificate (जात पडताळणी)** — BARTI Scrutiny Committee
10. **Digital Ration Card** — Food & Civil Supplies Department

Each guide provides:
- Authority name
- Supporting documents checklist
- Step-by-step application instructions (Online vs. Offline)
- Official application links
- Processing fees and timelines
- Verification badge (**Verified Official Guide**, **Verification Pending**, or **Outdated**)

### 5. Document Preparation Dashboard ("My Document Preparation")
- Consolidates all required documents across all matched schemes.
- **Deduplication:** If 3 schemes require an "Income Certificate", it appears once with badges showing all 3 dependent schemes.
- Overall readiness progress bar ($\%$ prepared).
- Direct "I Already Have This Document" toggle that updates the entire system instantly.

### 6. Grounded Multilingual AI Assistant
- Context-grounded Q&A engine that strictly references verified scheme records.
- Multilingual responses: Supports **English**, **Marathi (मराठी)**, and **Hindi (हिन्दी)**.
- Shortcut chips for quick citizen inquiries:
  - *"Why is this scheme recommended for me?"*
  - *"How do I get an Income Certificate in Maharashtra?"*
  - *"मराठीत माहिती द्या (Explain in Marathi)"*
  - *"सरल हिंदी में समझाइए (Explain in Hindi)"*
- Runs with a deterministic grounded engine out-of-the-box, with optional Gemini LLM integration via `GEMINI_API_KEY`.

### 7. Real-Time Government Updates & Live Sync
- Live ticker for scholarship deadlines, PM-Kisan installments, and policy updates.
- Interactive "Sync Live Feeds" button.

### 8. Admin Knowledge Base Console
- Add, update, verify, publish, and archive document guides.
- Review how many schemes reference each guide.
- Mark guides as **Verified** or **Outdated** to maintain data integrity.

---

## 5. College Viva Presentation Script (What to Say to Examiners)

```
Examiner: "What is the problem your project solves?"
You:
"Sir/Madam, citizens often miss out on government schemes because information
is fragmented across different departmental portals and eligibility rules are written
in complex legal language. Furthermore, citizens don't know what certificates they
need or how to obtain them. JanSahay AI personalizes scheme discovery, uses a
transparent deterministic rule engine to explain why a scheme matched, identifies
missing documents, and provides state-specific guides on how to obtain certificates
from official authorities without agent fees."

Examiner: "Why didn't you use AI directly to calculate eligibility?"
You:
"Sir, government eligibility rules must be 100% auditable and deterministic.
AI language models can hallucinate or change criteria. In JanSahay AI, our rule
engine performs deterministic mathematical evaluations against verified government
criteria, while our AI assistant is strictly grounded in that verified database to
explain the results in simple English, Marathi, or Hindi."

Examiner: "Show me a demo of a student in Maharashtra."
You:
1. Click '👨‍🎓 Student Demo' on the top bar or login page.
2. The system loads Rahul Patil (Undergrad B.Tech student in Pune, Income < ₹2L).
3. Open 'Recommendations' — observe 100% Strong Match for 'Rajarshi Chhatrapati Shahu Maharaj EBC Scholarship'.
4. Click 'Check Required Documents & Guidance'.
5. Point out Section A (Matched conditions), Section B (Missing Income Certificate warning),
   and Section C ('How to Obtain Missing Documents').
6. Click 'How to Get This Document' on Income Certificate — showcase the Aaple Sarkar online
   steps, Tehsildar issuing authority, ₹33.60 fee, and supporting documents.
7. Click 'I Already Have This Document' — watch the readiness bar update to 100%!
8. Open 'Ask JanSahay AI' and click 'मराठीत माहिती द्या' to show the Marathi explanation.
```

---

## 6. System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                   JANSAHAY AI ARCHITECTURE                       │
├─────────────────────────────────┬────────────────────────────────┤
│  Frontend (React 18 + Vite)     │   Backend (Node.js + Express)  │
│  - Plus Jakarta Sans UI         │   - JWT & Role Auth Middleware │
│  - React Router v6              │   - Deterministic Rule Engine  │
│  - Context (Auth & Language)    │   - Document Analysis Service  │
│  - Multilingual (EN, MR, HI)    │   - Grounded AI Engine         │
│  - 3-Section Scheme View        │   - Realtime Sync Service      │
│  - Prep Dashboard & Modal       │   - 10 Modular REST Routes     │
└─────────────────────────────────┴────────────────┬───────────────┘
                                                   │
                                                   ▼
                                     Embedded Persistent Store
                                     (jansahay-db.json in /data)
```

---

## 7. How to Start the Application

### Option A: 1-Click Windows Batch Script
Double-click `run.bat` in this folder.

### Option B: Command Line (PowerShell / Terminal)
```bash
# In the project directory
node start-dev.js
```
- Starts Backend on: `http://localhost:5000`
- Starts Frontend on: `http://localhost:5173`
- Open `http://localhost:5173` in any browser!
