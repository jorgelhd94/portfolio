import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import EducationCard from "../../molecules/EducationCard/EducationCard";

const Education = () => {
  return (
    <div className="mb-5">
      <div className="flex items-center space-x-2 mb-4">
        <FontAwesomeIcon icon={faGraduationCap} width={46} className="text-indigo-500"/>
        <h4 className="text-4xl dark:text-white font-medium"> Education </h4>
      </div>

      <div className="flex flex-row">
        <EducationCard/>
        <EducationCard/>
      </div>
    </div>
  );
};

export default Education;
