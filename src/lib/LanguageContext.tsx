"use client";

import React, { createContext, useContext, useState, useSyncExternalStore, useCallback } from "react";
import { translations, TranslationKey } from "@/lib/translations";

type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "id";
  const saved = localStorage.getItem("app_lang");
  if (saved === "id" || saved === "en") return saved;
  return "id";
}

// Use useSyncExternalStore to read localStorage without setState-in-effect lint errors
const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const initialLang = useSyncExternalStore(subscribe, getStoredLanguage, () => "id" as Language);
  const [language, setLanguage] = useState<Language>(initialLang);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const newLang = prev === "id" ? "en" : "id";
      localStorage.setItem("app_lang", newLang);
      return newLang;
    });
  }, []);

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    let str: string = translations[language][key] || key;
    if (params) {
      Object.keys(params).forEach(k => {
        str = str.replace(`{${k}}`, String(params[k]));
      });
    }
    return str;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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
