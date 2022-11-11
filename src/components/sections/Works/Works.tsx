import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import WorkCard from '../../molecules/Cards/WorkCard/WorkCard';
import TaskApp from '../../../../public/tasklist.jpg';
import QrApp from '../../../../public/niceqr.jpg';

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

      <div className="flex justify-between">
        <WorkCard image={QrApp} title="Nice QR" />
        <WorkCard image={TaskApp} title="Simple Task List" />
      </div>
    </div>
  );
};

export default Works;
