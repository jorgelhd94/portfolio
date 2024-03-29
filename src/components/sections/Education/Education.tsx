
import { faGraduationCap, faLanguage } from '@fortawesome/free-solid-svg-icons';
import EducationCard from '../../molecules/Cards/EducationCard/EducationCard';
import LanguageCard from '../../molecules/Cards/LanguageCard/LanguageCard';
import Spanish from '../../../assets/spanish.png';
import English from '../../../assets/english.png';
import TitleIcon from '../../molecules/TitleIcon/TitleIcon';
import { useTranslation } from "react-i18next";

const Education = () => {
  const { t } = useTranslation();
  const certificate = {
    url: 'https://www.efset.org/cert/QUGbGv',
    title: t('certificate'),
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-12 my-[30px] py-6 
                 md:pb-8 px-5 md:px-10 lg:px-14"
    >
      <div>
        <TitleIcon title={t('education')} icon={faGraduationCap} />

        <div className="flex flex-col gap-4 px-4 md:px-0">
          <EducationCard
            period="2009 - 2012"
            title={t('it_tech')}
            institution={t('institution_tech')}
          />
          <EducationCard
            period="2014 - 2019"
            title={t('computer_eng')}
            institution={t('university')}
          />
        </div>
      </div>

      <div>
        <TitleIcon title={t('languages')} icon={faLanguage} />

        <div className="flex flex-col px-4 md:px-0 gap-4">
          <LanguageCard
            level={t('native')}
            language={t('spanish')}
            percent={100}
            icon={Spanish}
          />
          <LanguageCard
            level={`C1 - ${t('advanced')}`}
            language={t('english')}
            percent={66}
            icon={English}
            progress
            certificate={certificate}
          />
        </div>
      </div>
    </div>
  );
};

export default Education;
