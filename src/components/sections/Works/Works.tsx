import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import TitleIcon from "../../molecules/TitleIcon/TitleIcon";
import { useTranslation } from "react-i18next";
import { TypeAnimation } from "react-type-animation";

const Works = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-12 pb-8 md:pb-12 px-5 md:px-10 lg:px-14">
      <TitleIcon title={t("works")} icon={faBriefcase} />

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
        <div className="mockup-code">
          <pre className="flex items-end gap-1">
            <code>
              <TypeAnimation
                sequence={[
                  "Work in progress...",
                  1000,
                  "Working with ReactJS...",
                  1000,
                  "Working with Typescript...",
                  1000,
                  "Working with NextJS...",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                style={{ fontSize: "1em", display: "inline-block" }}
                repeat={Infinity}
              />
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Works;
