
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import TitleIcon from '../../molecules/TitleIcon/TitleIcon';
import { useTranslation } from "react-i18next";

const Works = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-12 pb-8 md:pb-12 px-5 md:px-10 lg:px-14">
      <TitleIcon title={t('works')} icon={faBriefcase} />

      <div className="flex flex-col md:flex-row justify-center md:justify-start">
        {/* <WorkCard
          image={QrApp}
          title="Nice QR"
          urlApp="https://niceqr.netlify.app/"
          urlGithub="https://github.com/jorgelhd94/niceqr"
        >
          <span>{t('niceqr')}</span>
        </WorkCard>

        <WorkCard
          image={TaskApp}
          title="Simple Task List"
          urlApp="https://tasklistce.netlify.app/"
          urlGithub="https://github.com/jorgelhd94/task-list"
        >
          <span>{t('simple_task')}</span>
        </WorkCard> */}
      </div>
    </div>
  );
};

export default Works;
