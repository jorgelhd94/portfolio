import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SkillButton from "../../atoms/SkillButton/SkillButton";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { faHtml5, faJs } from "@fortawesome/free-brands-svg-icons";

const Skills = () => {
  return (
    <div className="container bg-color-810 dark:bg-[#0D0D0D] pt-12 md:pb-12 px-2 sm:px-5 md:px-10 lg:px-14">
      <div className="flex items-center space-x-2 mb-10">
        <FontAwesomeIcon icon={faLaptopCode} width={46} className="text-indigo-500"/>
        <h4 className="text-4xl dark:text-white font-medium"> Technical Skills </h4>
      </div>

      <div className="flex flex-row">
        <SkillButton icon={faJs} name="Javascript (ES6+)"  url="https://developer.mozilla.org/es/docs/Web/JavaScript" colorIcon="text-yellow-400"/>
        <SkillButton icon={faHtml5} name="HTML"  url="https://developer.mozilla.org/es/docs/Web/JavaScript" colorIcon="text-red-400"/>
      </div>
    </div>
  );
};

export default Skills;
