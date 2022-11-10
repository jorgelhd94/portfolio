import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faLanguage } from '@fortawesome/free-solid-svg-icons';
import EducationCard from '../../molecules/EducationCard/EducationCard';
import LanguageCard from '../../molecules/LanguageCard/LanguageCard';

const Education = () => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mt-[30px] pt-6 
                 md:pb-8 px-2 sm:px-5 md:px-10 lg:px-14"
    >
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center space-x-2 mb-10">
            <FontAwesomeIcon
              icon={faGraduationCap}
              width={46}
              className="text-indigo-500"
            />
            <h4 className="text-4xl dark:text-white font-medium">Education</h4>
          </div>
        </div>

        <div className="flex flex-col">
          <EducationCard
            period="2009-2012"
            title="IT Technician"
            institution="Rafael Morales School, Ciego de Avila"
          />
          <EducationCard
            period="2014-2019"
            title="Computer Engineer"
            institution="University of Ciego de Avila"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center space-x-2 mb-10">
            <FontAwesomeIcon
              icon={faLanguage}
              width={46}
              className="text-indigo-500"
            />
            <h4 className="text-4xl dark:text-white font-medium">Languages</h4>
          </div>
        </div>

        <div className="flex flex-col">
          <LanguageCard
          level='Native'
          language='Spanish'
          percent={100}
          />
          <LanguageCard
          level='B1 - B2'
          language='English'
          percent={60}
          />
        </div>
      </div>
    </div>
  );
};

export default Education;
