import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import enTranslations from "../locales/en.json";
import idTranslations from "../locales/id.json";

export type LanguageMode = "system" | "id" | "en";
export type ActiveLanguage = "id" | "en";
export type Translations = typeof enTranslations;

const translations: Record<ActiveLanguage, Translations> = {
  en: enTranslations,
  id: idTranslations,
};

function getSystemLanguage(): ActiveLanguage {
  if (typeof navigator === "undefined") return "en";
  const lang = (navigator.language || (navigator.languages && navigator.languages[0]) || "").toLowerCase();
  if (lang.startsWith("id")) return "id";
  return "en";
}

interface LanguageContextType {
  mode: LanguageMode;
  activeLang: ActiveLanguage;
  setMode: (mode: LanguageMode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<LanguageMode>(() => {
    return (localStorage.getItem("lang_mode") as LanguageMode) || "system";
  });

  const [activeLang, setActiveLang] = useState<ActiveLanguage>(() => {
    return mode === "system" ? getSystemLanguage() : mode;
  });

  useEffect(() => {
    localStorage.setItem("lang_mode", mode);
    if (mode === "system") {
      setActiveLang(getSystemLanguage());
    } else {
      setActiveLang(mode);
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const handleLanguageChange = () => {
      setActiveLang(getSystemLanguage());
    };
    window.addEventListener("languagechange", handleLanguageChange);
    return () => window.removeEventListener("languagechange", handleLanguageChange);
  }, [mode]);

  const setMode = (newMode: LanguageMode) => {
    setModeState(newMode);
  };

  const t = translations[activeLang];

  return React.createElement(
    LanguageContext.Provider,
    { value: { mode, activeLang, setMode, t } },
    children
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};