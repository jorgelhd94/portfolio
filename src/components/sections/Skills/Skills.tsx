import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faGraduationCap, faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import EducationCard from "../../molecules/EducationCard/EducationCard";

const Skills = () => {
  return (
    <div className="container bg-color-810 dark:bg-[#0D0D0D] pt-12 md:pb-12 px-2 sm:px-5 md:px-10 lg:px-14">
      <div className="flex items-center space-x-2 mb-10">
        <FontAwesomeIcon icon={faLaptopCode} width={46} className="text-indigo-500"/>
        <h4 className="text-4xl dark:text-white font-medium"> Technical Skills </h4>
      </div>

      <div className="flex flex-row">
        <EducationCard period="2009-2012" title="IT Technician" institution="Rafael Morales Polytecnic, Ciego de Avila"/>
        <EducationCard period="2014-2019" title="Computer Engineer" institution="University of Ciego de Avila"/>
      </div>
    </div>
  );
};

export default Skills;
