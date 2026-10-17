# 🇮🇳 JanSahay AI — Government Scheme Discovery & Smart Document Guidance System

> **College Mini-Project | Computer Engineering | Academic Year 2026-27**

A full-stack web application that helps Indian citizens discover relevant government welfare schemes, understand eligibility in simple language, identify missing documents, and follow step-by-step document acquisition and application guides.

---

## 🚀 Quick Start (3 Steps)

### Step 1 — First-Time Setup (Only Once)
```
Double-click: setup.bat
```
This installs all dependencies automatically.

### Step 2 — Run the App
```
Double-click: run.bat
```
OR in terminal:
```bash
node start-dev.js
```

### Step 3 — Open in Browser
- **Citizen Portal:** http://localhost:5173
- **API Server:** http://localhost:5000/api/health

---

## 🎯 1-Click Demo Login Credentials

| Role | Email | Password | Demonstrates |
|------|-------|----------|-------------|
| 👨‍🎓 Student | `student@jansahay.ai` | `Student@123` | Scholarship matching, income/caste cert guidance |
| 🌾 Farmer | `farmer@jansahay.ai` | `Farmer@123` | PM-KISAN, Fasal Bima, Namo Shetkari matching |
| 💼 Business | `business@jansahay.ai` | `Business@123` | PMEGP, Mudra Yojana, Startup India |
| 🛡️ Admin | `admin@jansahay.gov.in` | `Admin@123` | Full admin dashboard |

> **Or just click the 1-click demo buttons on the Login page — no typing needed!**

---

## 📋 Features

### 1. Personalized Citizen Profile (Progressive Questions)
- Category-based wizard: Student, Farmer, Business Owner, Job Seeker, General Citizen
- Asks only questions relevant to the citizen's situation
- **Privacy First:** Never collects Aadhaar numbers, bank details, or passwords

### 2. Explainable Eligibility Matching Engine
- Evaluates each scheme rule-by-rule against citizen profile
- Returns: **Strong Match** / **Potential Match** / **More Info Required** / **Not a Match**
- Shows exactly which conditions matched, which failed, and which are unknown

### 3. Automatic Missing-Document Detection
- Compares scheme requirements against citizen's document checklist
- Status tracking: ✅ Available | ❌ Missing | ⚠️ Needs Verification | ❓ Not Checked
- Real-time readiness percentage per scheme

### 4. 9-Point Smart Document Acquisition Guides
Each guide includes:
1. What is this document?
2. Why do you need it?
3. Issuing authority
4. State-specific procedure
5. Required supporting documents
6. Online application steps (Aaple Sarkar, UMANG, DigiLocker)
7. Offline / CSC Kiosk steps
8. Official government portal links
9. Fees, timelines & citizen tips

### 5. Consolidated Document Preparation Dashboard
- **Cross-scheme deduplication:** One Income Certificate covers 4 schemes — shown once
- Print/Save as PDF official document checklist
- Offline CSC Kiosk guidance for citizens without internet access

### 6. Scheme Application Roadmap
- Step-by-step numbered application process per scheme
- Direct links to official government portals
- Printable roadmap PDF

### 7. Multilingual AI Assistant
- Responds in **English**, **मराठी (Marathi)**, and **हिन्दी (Hindi)**
- Grounded strictly on the verified scheme and document knowledge base
- No hallucinations — falls back to transparent "not yet verified" messaging

### 8. Real-Time Policy Updates
- Live feed of verified government announcements
- Scholarship deadline extensions, DBT notifications, portal alerts
- "Sync Live Feeds" button to refresh

### 9. Admin Knowledge Base Management
- Create, edit, verify, and publish schemes
- Manage document acquisition guides
- Broadcast policy announcements

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Custom CSS (NIC/Gov.in style) |
| **Backend** | Node.js + Express.js (ESM modules) |
| **Database** | File-backed JSON database (`server/data/jansahay-db.json`) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **AI** | Grounded deterministic engine (optional Gemini API upgrade) |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |

> **Why file-based DB?** Zero setup, zero cloud credentials, works instantly on any machine — perfect for college demos and local presentations.

---

## 📁 Project Structure

```
JanSahay-github/
├── setup.bat              ← Run once to install dependencies
├── run.bat                ← Launch full app (backend + frontend)
├── start-dev.js           ← Node launcher script
├── package.json
│
├── server/                ← Node.js + Express Backend
│   ├── src/
│   │   ├── server.js      ← Express app entry point
│   │   ├── config.js      ← Environment config
│   │   ├── db/
│   │   │   ├── database.js   ← File-backed JSON CRUD engine
│   │   │   └── seedData.js   ← 12 schemes, 10 doc guides, 4 users
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── adminMiddleware.js
│   │   ├── routes/        ← 10 REST route modules
│   │   └── services/
│   │       ├── eligibilityEngine.js       ← Deterministic rule evaluator
│   │       ├── documentAnalysisService.js ← Cross-scheme deduplication
│   │       ├── aiService.js               ← Multilingual grounded AI
│   │       └── realtimeService.js         ← Live updates sync
│   └── data/
│       └── jansahay-db.json  ← Persistent database file
│
└── client/                ← React 18 + Vite Frontend
    ├── src/
    │   ├── App.jsx        ← Router (11 pages)
    │   ├── main.jsx
    │   ├── index.css      ← NIC-style civic design system
    │   ├── context/
    │   │   ├── AuthContext.jsx     ← JWT auth state
    │   │   └── LanguageContext.jsx ← EN/MR/HI translations
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── AIChatDrawer.jsx         ← Floating AI assistant
    │   │   └── DocumentGuideModal.jsx   ← 9-point guide modal
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── ProfileWizardPage.jsx
    │   │   ├── RecommendationsPage.jsx
    │   │   ├── SchemesCatalogPage.jsx
    │   │   ├── SchemeDetailPage.jsx
    │   │   ├── DocumentPreparationPage.jsx
    │   │   ├── DocumentGuidesCatalogPage.jsx
    │   │   ├── LiveUpdatesPage.jsx
    │   │   └── AdminDashboardPage.jsx
    │   └── services/
    │       └── api.js     ← Axios + JWT interceptor
    └── dist/              ← Production build output
```

---

## 🔌 REST API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/health` | GET | — | Server health check |
| `/api/auth/login` | POST | — | Login with email/password |
| `/api/auth/register` | POST | — | Register new citizen |
| `/api/auth/quick-login` | POST | — | 1-click demo login |
| `/api/profile` | GET/POST | ✅ | Get / save citizen profile |
| `/api/schemes` | GET | — | Paginated schemes catalog |
| `/api/schemes/:id` | GET | — | Single scheme details |
| `/api/schemes/:id/document-readiness` | GET | ✅ | Doc readiness for scheme |
| `/api/recommendations` | GET | ✅ | Personalized eligibility matches |
| `/api/documents` | GET | ✅ | User document checklist |
| `/api/documents/status` | PUT | ✅ | Update document status |
| `/api/documents/preparation-dashboard` | GET | ✅ | Consolidated deduped dashboard |
| `/api/documents/guides` | GET | — | All document guides |
| `/api/documents/guides/by-type/:type` | GET | — | Guide by document type |
| `/api/ai/chat` | POST | — | AI assistant question/answer |
| `/api/updates` | GET | — | Policy updates feed |
| `/api/realtime/sync` | POST | — | Trigger live data sync |
| `/api/admin/*` | ALL | ✅ Admin | Admin CRUD operations |

---

## 📊 Pre-Loaded Government Schemes (12 Verified)

| # | Scheme | Level | Category |
|---|--------|-------|----------|
| 1 | Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC) | State | Education |
| 2 | Dr. Punjabrao Deshmukh Vastigruh Nirvah Bhatta Yojna | State | Education |
| 3 | Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) | Central | Agriculture |
| 4 | Namo Shetkari Mahasanman Nidhi Yojana | State | Agriculture |
| 5 | Pradhan Mantri Mudra Yojana (PMMY) | Central | Business |
| 6 | Chief Minister Employment Generation Programme (CMEGP) | State | Business |
| 7 | Pradhan Mantri Awas Yojana - Urban (PMAY-U) | Central | Housing |
| 8 | Ayushman Bharat - PM Jan Arogya Yojana (PM-JAY) | Central | Healthcare |
| 9 | PM Vishwakarma Scheme | Central | Business |
| 10 | Startup India Seed Fund Scheme (SISFS) | Central | Business |
| 11 | Post Matric Scholarship for SC/ST Students | State | Education |
| 12 | Pradhan Mantri Fasal Bima Yojana (PMFBY) | Central | Agriculture |

---

## 📄 Smart Document Guides (10 Verified)

| Document | Issuing Authority | State |
|----------|------------------|-------|
| Income Certificate (उत्पन्नाचा दाखला) | Tehsildar / SDO | Maharashtra |
| Domicile & Nationality Certificate | Executive Magistrate | Maharashtra |
| Caste Certificate (जातीचे प्रमाणपत्र) | Sub-Divisional Officer | Maharashtra |
| Non-Creamy Layer Certificate (NCL) | SDO / Tehsildar | Maharashtra |
| 7/12 & 8A Land Extract | Talathi / Mahabhumi Portal | Maharashtra |
| Udyam MSME Registration | Ministry of MSME | All India |
| College Bonafide Certificate | College/Institute Administration | All India |
| UDID Disability Certificate | CMO / Civil Hospital | All India |
| Caste Validity Certificate | Caste Scrutiny Committee | Maharashtra |
| Digital Ration Card | Food & Civil Supplies Dept. | Maharashtra |

---

## 🎓 College Viva Presentation Script (5 Minutes)

1. **Intro (30s):** Open http://localhost:5173 → switch language to **मराठी** (top bar) to show vernacular support
2. **Profile & Matching (90s):** Click **"Student Demo"** on Login → go to `/recommendations` → show 5 Strong Matches with transparent rule explanations
3. **Missing Docs & Guide (90s):** Click any scheme → scroll to **Section B** (Documents Checklist) → click orange **"How to Get This Document"** for Caste Validity Certificate
4. **Preparation Dashboard (60s):** Click **"My Documents"** nav link → show cross-scheme deduplication → click **"Print / Save PDF"**
5. **AI & Updates (30s):** Open the AI chat bubble (bottom right) → ask *"Income certificate kaise milega?"* → open `/updates` for policy alerts

---

## 📌 Important Note on Data

All scheme and document information stored in this application comes from verified government portals (MahaDBT, PM-KISAN, PMAY official portals) and is clearly labelled with `lastVerifiedAt` dates. The system does **not** claim real-time live data unless explicitly synced. Citizens are always directed to official government portals for final verification.

---

*Built with ❤️ for Digital India | JanSahay AI v2.0 | 2026*
