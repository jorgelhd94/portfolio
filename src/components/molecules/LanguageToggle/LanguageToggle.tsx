import React, { useState } from 'react';
import LanguageButton from '../../atoms/Buttons/LanguageButton/LanguageButton';
import Spanish from '../../../../public/spanish.png';
import English from '../../../../public/english.png';
import LanguageList from '../LanguageList/LanguageList';
import { ILanguage } from '../../../interfaces/ILanguage';
import { useRouter } from 'next/router';
import nextI18nextConfig from '../../../../next-i18next.config';

const languages = [
  { src: English.src, alt: 'English', code: 'en' },
  { src: Spanish.src, alt: 'Español', code: 'es' },
];

const LanguageToggle = () => {
  const router = useRouter();
  const lang = router.query.locale || nextI18nextConfig.i18n.defaultLocale;

  const getLanguageImageByCode = (
    lang: string | string[],
  ): ILanguage | null => {
    if (typeof lang === 'string') {
      return (
        languages.find((language) => language.code === lang) || languages[0]
      );
    }
    return null;
  };

  const [languageSelected, setLanguageSelected] = useState(
    getLanguageImageByCode(lang),
  );

  const [showList, setShowList] = useState(false);

  const toggleShow = () => {
    setShowList(!showList);
  };

  const selectLanguage = (code: string) => {
    setLanguageSelected(getLanguageImageByCode(code));
    toggleShow();
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
