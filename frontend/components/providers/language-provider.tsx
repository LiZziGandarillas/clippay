"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/lib/translations";

type Language = "en" | "es";

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: typeof translations.en;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    // Only set initial language on client side
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "es") {
      setLang("es");
    }
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "es" : "en"));
  };

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
  };

  const value = {
    lang,
    toggleLanguage,
    t: translations[lang],
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
