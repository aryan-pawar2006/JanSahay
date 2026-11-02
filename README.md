# JanSahay 2.0 – Government Scheme Discovery and Smart Document Guidance System 🇮🇳

An AI-assisted, citizen-centric full-stack platform built with **Java 17, Spring Boot 3.x, MySQL 8, and React 18**. JanSahay bridges the gap between everyday Indian citizens and government welfare programs, providing deterministic eligibility evaluation, step-by-step document guides, application roadmaps, and grounded multilingual assistance in **English, Marathi (मराठी), and Hindi (हिंदी)**.

---

## 🚀 Key Features

- **🔍 Intelligent Scheme Discovery & Real-Time Sync:** Explore 40+ verified central and state government schemes (education, agriculture, healthcare, housing, social welfare) with dynamic syncing from official government portals (`myscheme.gov.in`, `data.gov.in`, `mahadbt.maharashtra.gov.in`, `aaplesarkar.mahaonline.gov.in`).
- **🎯 Deterministic Eligibility Engine:** Evaluates citizen profiles (Age, Category, Income, Domicile, Occupation, Landholding) with explainable condition-by-condition match reports (Strong Match, Potential Match, Missing Info).
- **📑 Citizen In-Hand Document Registry:** During registration and profile management, citizens register documents already in hand. When viewing any scheme, the platform automatically separates:
  - **Section A:** Documents Completed & Ready in Hand (with green badge).
  - **Section B:** Still Needed Documents (deduplicated, with 1-click step-by-step official acquisition guides).
- **🏛️ Direct Government Application Portals:** 1-click direct redirection buttons (`Apply Officially on Govt Portal`) linking straight to verified sanctioning authority websites.
- **📋 Step-by-Step Document Generation Guides:** Detailed modals for all certificates (Income, Domicile, Caste, Non-Creamy Layer, 7/12 & 8A extracts, UDID, Ration Card) complete with prerequisites checklist, numbered workflow steps, statutory RTS timelines, fees, and official issuing portals.
- **🤖 Grounded Multilingual AI Assistant:** Minimalist, uncluttered conversational assistant trained on 50+ citizen scenarios (7/12 vs Ferfar mutation, caste validity lifetime rules, scholarship disbursement delays, fee overcharging complaints, landless farm laborer welfare, Aadhaar OTP and NPCI DBT seeding) with one-click **"💬 Ask AI About This Scheme"** buttons.
- **🛡️ Enterprise Security:** Stateless JWT bearer token authentication, BCrypt password encryption (strength 12), and role-based access control (`CITIZEN` vs `ADMIN`).

---

## 🛠️ Technology Stack

### Backend
- **Language:** Java 17 (OpenJDK 25 LTS compatible)
- **Framework:** Spring Boot 3.2.0
- **Data Persistence:** Spring Data JPA / Hibernate ORM
- **Database:** MySQL 8.0 (`jansahay_db`)
- **Security:** Spring Security 6 with JWT (`io.jsonwebtoken`)
- **Build Tool:** Apache Maven 3.9

### Frontend
- **Library:** React 18
- **Build Tool:** Vite 5
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios with JWT Interceptors
- **Icons:** Lucide React

---

## 📁 Repository Structure

```
JanSahay/
├── client/                     # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navigation, AI Chat Drawer, Modals
│   │   ├── pages/              # Catalog, Roadmaps, Dashboard, Auth
│   │   └── services/           # Axios API connectors
│   └── package.json
│
├── server/                     # Java Spring Boot 3 Backend
│   ├── src/main/java/com/jansahay/
│   │   ├── config/             # SecurityConfig, CorsConfig
│   │   ├── controller/         # REST Controllers (Auth, Schemes, AI, etc.)
│   │   ├── entity/             # JPA Relational Entities
│   │   ├── repository/         # Spring Data JPA Repositories
│   │   ├── service/            # Business Logic & Eligibility Engine
│   │   └── security/           # JWT Filters & UserDetailsService
│   ├── src/main/resources/     # application.properties, data.sql
│   └── pom.xml
│
├── documentation/              # Technical Specifications
│   ├── SYSTEM_ARCHITECTURE.md  # Layered system architecture & data flow
│   ├── DATABASE_DESIGN.md      # Relational schema & entity specifications
│   ├── API_DOCUMENTATION.md    # REST API contracts & sample payloads
│   └── SETUP_GUIDE.md          # Local installation & execution steps
│
├── run.bat                     # One-click Windows application launcher
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
1. **Java 17+** (`java -version`)
2. **Maven 3.8+** (`mvn -version`)
3. **MySQL 8.0+** running locally on port `3306`
4. **Node.js 18+** (`node -v`)

### 1. Launch Backend (Spring Boot)
```bash
cd server
mvn spring-boot:run
```
*The Spring Boot server will initialize the schema, execute `data.sql` seeding, and listen on `http://localhost:8080`.*

### 2. Launch Frontend (React + Vite)
```bash
cd client
npm run dev
```
*Open `http://localhost:5173` in your browser.*

### 3. One-Click Startup (Windows)
Double-click or run:
```bat
run.bat
```

---

## 👥 Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Administrator** | `admin@jansahay.gov.in` | `Password@123` |
| **Citizen (Student Profile)** | `student@jansahay.ai` | `Password@123` |
| **Citizen (Farmer Profile)** | `farmer@jansahay.ai` | `Password@123` |
| **Citizen (Aryan Pawar)** | `aryanpawar03022006@gmail.com` | `Password@123` |
