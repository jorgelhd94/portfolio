
import SkillButton from "../../atoms/Buttons/SkillButton/SkillButton";
import {
  faCat,
  faDatabase,
  faFire,
  faLaptopCode,
  faN,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBootstrap,
  faCss3,
  faGitAlt,
  faGithub,
  faHtml5,
  faJs,
  faNodeJs,
  faPython,
  faReact,
  faVuejs,
} from "@fortawesome/free-brands-svg-icons";
import TitleIcon from "../../molecules/TitleIcon/TitleIcon";
import { useTranslation } from "react-i18next";

const Skills = () => {
  const { t } = useTranslation("common");

  return (
    <div className="container bg-slate-200 dark:bg-[#0D0D0D] pt-12 pb-8 md:pb-12 px-4 sm:px-5 md:px-10 lg:px-14">
      <TitleIcon title={t("tech_skills")} icon={faLaptopCode} />

      <div className="flex flex-row flex-wrap justify-center">
        <SkillButton
          icon={faJs}
          name="Javascript (ES6+)"
          url="https://developer.mozilla.org/es/docs/Web/JavaScript"
          colorIcon="text-yellow-400"
        />
        <SkillButton
          icon={faJs}
          name="TypeScript"
          url="https://www.typescriptlang.org/"
          colorIcon="text-blue-500"
        />
        <SkillButton
          icon={faPython}
          name="Python"
          url="https://www.python.org/"
          colorIcon="text-sky-600"
        />
        <SkillButton
          icon={faHtml5}
          name="HTML5"
          url="https://developer.mozilla.org/es/docs/Web/HTML"
          colorIcon="text-red-400"
        />
        <SkillButton
          icon={faCss3}
          name="CSS3"
          url="https://developer.mozilla.org/es/docs/Web/CSS"
          colorIcon="text-sky-300"
        />
        <SkillButton
          icon={faNodeJs}
          name="NodeJS"
          url="https://nodejs.org/en/"
          colorIcon="text-green-600"
        />
        <SkillButton
          icon={faCat}
          name="NestJS"
          url="https://nestjs.com/"
          colorIcon="text-red-500"
        />
        <SkillButton
          icon={faReact}
          name="ReactJS"
          url="https://reactjs.org/"
          colorIcon="text-blue-500"
        />
        <SkillButton
          icon={faN}
          name="NextJS"
          url="https://nextjs.org/"
          colorIcon="text-black dark:text-white"
        />
        <SkillButton
          icon={faVuejs}
          name="VueJS"
          url="https://vuejs.org/"
          colorIcon="text-green-600"
        />
        <SkillButton
          icon={faFire}
          name="Firebase"
          url="https://firebase.google.com/"
          colorIcon="text-yellow-500"
        />
        <SkillButton
          icon={faWind}
          name="TailwindCss"
          url="https://tailwindcss.com/"
          colorIcon="text-cyan-500"
        />
        <SkillButton
          icon={faBootstrap}
          name="Boostrap 3+"
          url="https://getbootstrap.com/"
          colorIcon="text-purple-500"
        />
        <SkillButton
          icon={faGitAlt}
          name="Git"
          url="https://git-scm.com/"
          colorIcon="text-red-500"
        />
        <SkillButton
          icon={faGithub}
          name="Github"
          url="https://github.com/"
          colorIcon="text-black dark:text-white"
        />
        <SkillButton
          icon={faDatabase}
          name="MySQL"
          url="https://www.mysql.com/"
          colorIcon="text-cyan-600"
        />
        <SkillButton
          icon={faDatabase}
          name="PostgreSQL"
          url="https://www.postgresql.org/"
          colorIcon="text-blue-600"
        />
        <SkillButton
          icon={faDatabase}
          name="Sqlite"
          url="https://www.sqlite.org/"
          colorIcon="text-sky-400"
        />
      </div>
    </div>
  );
};

export default Skills;
