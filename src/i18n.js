import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./translation/en/global.json";
import fr from "./translation/fr/global.json";

const normalizeLanguage = (lng) => {
  if (!lng) return "en";
  const code = lng.split("-")[0].toLowerCase();
  return code === "fr" ? "fr" : "en";
};

const savedLanguage =
  typeof window !== "undefined"
    ? normalizeLanguage(localStorage.getItem("i18nextLng"))
    : "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { global: en },
      fr: { global: fr },
    },
    lng: savedLanguage,
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      convertDetectedLanguage: normalizeLanguage,
    },
  });

if (typeof document !== "undefined") {
  document.documentElement.lang = savedLanguage;
  i18n.on("languageChanged", (lng) => {
    document.documentElement.lang = normalizeLanguage(lng);
  });
}

export default i18n;
