import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

export const translations = {
  en: {
    appTitle: "JanSahay AI",
    tagline: "Discover. Understand. Prepare. Apply.",
    home: "Home",
    schemes: "Schemes Catalog",
    recommendations: "Find Schemes",
    preparation: "My Document Prep",
    documentGuides: "Document Guides",
    updates: "Live Updates",
    admin: "Admin Console",
    login: "Sign In",
    logout: "Sign Out",
    welcome: "Welcome",
    quickDemoProfiles: "Quick Demo Profiles (1-Click Test)",
    studentDemo: "Student (Pune, MH)",
    farmerDemo: "Farmer (Satara, MH)",
    businessDemo: "Startup (Mumbai, MH)",
    adminDemo: "Admin Login",
    matchStrong: "Strong Match",
    matchPotential: "Potential Match",
    matchMoreInfo: "More Info Required",
    howToGetDoc: "How to Get This Document",
    verifiedBadge: "Verified Source",
    unverifiedBadge: "Verification Pending",
    outdatedBadge: "Outdated - Needs Review"
  },
  mr: {
    appTitle: "जनसहाय AI",
    tagline: "शोधा. समजून घ्या. तयार व्हा. अर्ज करा.",
    home: "मुख्यपृष्ठ",
    schemes: "शासकीय योजना सूची",
    recommendations: "माझ्या योजना",
    preparation: "कागदपत्र तयारी",
    documentGuides: "दाखला मार्गदर्शन",
    updates: "थेट घडामोडी",
    admin: "प्रशासक पॅनेल",
    login: "प्रवेश करा",
    logout: "बाहेर पडा",
    welcome: "स्वागत आहे",
    quickDemoProfiles: "डेमो प्रोफाइल निवडा (एक-क्लिक चाचणी)",
    studentDemo: "विद्यार्थी (पुणे, महा.)",
    farmerDemo: "शेतकरी (सातारा, महा.)",
    businessDemo: "उद्योजक (मुंबई, महा.)",
    adminDemo: "प्रशासक प्रवेश",
    matchStrong: "उत्कृष्ट जुळणी (Strong Match)",
    matchPotential: "संभाव्य जुळणी (Potential)",
    matchMoreInfo: "अजून माहिती आवश्यक",
    howToGetDoc: "हा दाखला कसा मिळवायचा?",
    verifiedBadge: "सत्यापित माहिती",
    unverifiedBadge: "तपासणी प्रलंबित",
    outdatedBadge: "जुनी माहिती"
  },
  hi: {
    appTitle: "जनसहाय AI",
    tagline: "खोजें। समझें। तैयारी करें। आवेदन करें।",
    home: "मुख्य पृष्ठ",
    schemes: "योजना सूची",
    recommendations: "पात्र योजनाएं",
    preparation: "दस्तावेज़ तैयारी",
    documentGuides: "दस्तावेज़ गाइड",
    updates: "लाइव अपडेट्स",
    admin: "एडमिन पैनल",
    login: "लॉग इन",
    logout: "लॉग आउट",
    welcome: "स्वागत है",
    quickDemoProfiles: "डेमो प्रोफाइल (1-क्लिक टेस्ट)",
    studentDemo: "छात्र (पुणे, महा.)",
    farmerDemo: "किसान (सातारा, महा.)",
    businessDemo: "उद्यमी (मुंबई, महा.)",
    adminDemo: "एडमिन लॉगिन",
    matchStrong: "सटीक पात्रता (Strong Match)",
    matchPotential: "संभावित पात्रता",
    matchMoreInfo: "अतिरिक्त जानकारी आवश्यक",
    howToGetDoc: "यह दस्तावेज़ कैसे प्राप्त करें?",
    verifiedBadge: "सत्यापित जानकारी",
    unverifiedBadge: "जांच लंबित",
    outdatedBadge: "अद्यतन आवश्यक"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('jansahay_lang') || 'en');

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('jansahay_lang', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
