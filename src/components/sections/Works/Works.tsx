import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import WorkCard from '../../molecules/Cards/WorkCard/WorkCard';
import TaskApp from '../../../../public/tasklist.png';
import QrApp from '../../../../public/qrcode.png';

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

      <div className="flex justify-start">
        <WorkCard
          image={QrApp}
          title="Nice QR"
          urlApp="https://niceqr.netlify.app/"
          urlGithub="https://github.com/jorgelhd94/niceqr"
        >
          <span>NiceQR is a Vue 3 app to generate beautiful qr codes.</span>
        </WorkCard>

        <WorkCard
          image={TaskApp}
          title="Simple Task List"
          urlApp="https://tasklistce.netlify.app/"
          urlGithub="https://github.com/jorgelhd94/task-list"
        >
          <span>Simple Task is a Vue 3 app to manage To-Do tasks.</span>
        </WorkCard>
      </div>
    </div>
  );
};

export default Works;
