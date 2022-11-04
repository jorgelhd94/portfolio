import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import EducationCard from "../../molecules/EducationCard/EducationCard";

const Education = () => {
  return (
    <div className="mb-5">
      <div className="flex items-center space-x-2 mb-8">
        <FontAwesomeIcon icon={faGraduationCap} width={46} className="text-indigo-500"/>
        <h4 className="text-4xl dark:text-white font-medium"> Education </h4>
      </div>

      <div className="flex flex-row">
        <EducationCard period="2009-2012" title="IT Technician" institution="Rafael Morales Polytecnic, Ciego de Avila"/>
        <EducationCard period="2014-2019" title="Computer Engineer" institution="University of Ciego de Avila"/>
      </div>
    </div>
  );
};

export default Education;
