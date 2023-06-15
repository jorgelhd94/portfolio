import { useState } from "react";
import LanguageButton from "../../atoms/Buttons/LanguageButton/LanguageButton";
import Spanish from "../../../assets/spanish.png";
import English from "../../../assets/english.png";
import LanguageList from "../LanguageList/LanguageList";
import { Language } from "../../../interfaces/Language";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const languages = [
  { src: English, alt: "English", code: "en" },
  { src: Spanish, alt: "Español", code: "es" },
];

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const lang = i18next.resolvedLanguage || "es";

  const getLanguageImageByCode = (lang: string | string[]): Language | null => {
    if (typeof lang === "string") {
      return (
        languages.find((language) => language.code === lang) || languages[0]
      );
    }
    return null;
  };

  const [languageSelected, setLanguageSelected] = useState(
    getLanguageImageByCode(lang)
  );

  const [showList, setShowList] = useState(false);

  const toggleShow = () => {
    setShowList(!showList);
  };

  const selectLanguage = (code: string) => {
    setLanguageSelected(getLanguageImageByCode(code));
    toggleShow();
    i18n.changeLanguage(code)
  };

  return (
    <div className="relative">
      {languageSelected ? (
        <LanguageButton
          image={languageSelected.src}
          alt={languageSelected.alt}
          onClick={toggleShow}
        />
      ) : null}

      {showList && (
        <div className="absolute top-[100%] right-2 w-36 h-min bg-white rounded z-50">
          <LanguageList
            languages={languages}
            onClickItem={(code: string) => selectLanguage(code)}
          />
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
