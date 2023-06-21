import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="pt-12 md:pt-12 md:pb-8 px-5 md:px-10 lg:px-14">
      <h2 className="title-section after:left-52">{t("about")}</h2>

      <div className="grid grid-cols-12 md:gap-10 pt-4 md:pt-[30px] items-center">
        <div className="col-span-12 space-y-2.5">
          <div className="xl:mr-16">
            <p className="leading-7">{t("about_description_1")}</p>
            <p className="leading-7 mt-2.5">
              {t("about_description_2")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
