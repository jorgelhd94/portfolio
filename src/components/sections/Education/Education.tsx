import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import EducationCard from '../../molecules/EducationCard/EducationCard';

const Education = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-6 mt-[30px]">
      <div>
        <div className="pt-6 md:pb-12 px-4 md:px-10 lg:px-14">
          <div className="flex items-center space-x-2 mb-10">
            <FontAwesomeIcon
              icon={faGraduationCap}
              width={46}
              className="text-indigo-500"
            />
            <h4 className="text-4xl dark:text-white font-medium">
              Education
            </h4>
          </div>

          <div className="flex flex-col">
            <EducationCard
              period="2009-2012"
              title="IT Technician"
              institution="Rafael Morales Polytecnic, Ciego de Avila"
            />
            <EducationCard
              period="2014-2019"
              title="Computer Engineer"
              institution="University of Ciego de Avila"
            />
          </div>
        </div>

        <div className="pt-6 md:pb-12 px-4 md:px-10 lg:px-14">
          <div className="flex items-center space-x-2 mb-4">
            <h4 className="text-5xl dark:text-white font-medium">Experience</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
