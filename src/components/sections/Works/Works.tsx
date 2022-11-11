import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';

const Works = () => {
  return (
    <div className="containe pt-12 pb-8 md:pb-12 px-4 sm:px-5 md:px-10 lg:px-14">
      <div className="flex items-center space-x-3 mb-10">
        <FontAwesomeIcon
          icon={faBriefcase}
          width={38}
          className="text-indigo-600"
        />
        <h4 className="text-4xl dark:text-white font-medium">Works</h4>
      </div>

      <div className="flex flex-row  flex-wrap md:justify-around justify-center"></div>
    </div>
  );
};

export default Works;
