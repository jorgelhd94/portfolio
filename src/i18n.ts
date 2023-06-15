import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import localesI18n from "./locales/common";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {...localesI18n},
    interpolation: {
      escapeValue: false,
    },
  });


export default i18n;
