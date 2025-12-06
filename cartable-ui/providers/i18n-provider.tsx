"use client";

import { ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { DirectionProvider as RadixDirectionProvider } from "@radix-ui/react-direction";
import { I18N_LANGUAGES } from "@/i18n/config";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enTranslations from "@/i18n/langs/en.json";
import arTranslations from "@/i18n/langs/ar.json";
import faTranslations from "@/i18n/langs/fa.json";

interface I18nProviderProps {
  children: ReactNode;
}

function I18nProvider({ children }: I18nProviderProps) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    // Initialize i18n only on client side
    if (!i18n.isInitialized) {
      const resources = {
        en: { translation: enTranslations },
        // ar: { translation: arTranslations },
        fa: { translation: faTranslations },
      };

      // Get stored language or use default
      const storedLanguage =
        typeof window !== "undefined" ? localStorage.getItem("language") : null;
      const defaultLng = storedLanguage || "fa";

      i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
          resources,
          lng: defaultLng, // Set initial language
          fallbackLng: "fa", // Changed to Persian as default
          debug: process.env.NODE_ENV === "development",
          supportedLngs: ["fa", "en"], // Explicitly define supported languages

          interpolation: {
            escapeValue: false, // React already does escaping
          },

          detection: {
            order: ["localStorage", "navigator", "htmlTag"],
            caches: ["localStorage"],
            lookupLocalStorage: "language",
          },

          react: {
            useSuspense: false, // Important for Next.js SSR
          },
        })
        .then(() => {
          setIsI18nInitialized(true);
        });
    } else {
      setIsI18nInitialized(true);
    }

    // Update document direction and lang attribute when language changes
    const handleLanguageChange = (lng: string) => {
      const language = I18N_LANGUAGES.find((lang) => lang.code === lng);
      if (language) {
        document.documentElement.setAttribute("dir", language.direction);
        document.documentElement.setAttribute("lang", lng);
        // Ensure language is saved to localStorage
        localStorage.setItem("language", lng);
      }
    };

    // Set initial direction and language
    if (i18n.language) {
      handleLanguageChange(i18n.language);
    }

    // Listen for language changes
    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  // Get current language for direction
  const currentLanguage =
    I18N_LANGUAGES.find((lang) => lang.code === (i18n.language || "en")) ||
    I18N_LANGUAGES[0];

  // Don't render until i18n is initialized
  if (!isI18nInitialized) {
    return (
      <RadixDirectionProvider dir="ltr">{children}</RadixDirectionProvider>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <RadixDirectionProvider dir={currentLanguage.direction}>
        {children}
      </RadixDirectionProvider>
    </I18nextProvider>
  );
}

const useLanguage = () => {
  const currentLanguage =
    I18N_LANGUAGES.find((lang) => lang.code === i18n.language) ||
    I18N_LANGUAGES[0];

  const changeLanguage = (code: string) => {
    // Validate that the language code is supported
    const isSupported = I18N_LANGUAGES.some((lang) => lang.code === code);
    if (isSupported) {
      i18n.changeLanguage(code);
      localStorage.setItem("language", code);
    } else {
      console.warn(`Language code "${code}" is not supported`);
    }
  };

  return {
    languageCode: i18n.language,
    language: currentLanguage,
    changeLanguage,
  };
};

export { I18nProvider, useLanguage };
