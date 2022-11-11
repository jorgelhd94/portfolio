import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

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

      <div className="flex flex-row flex-wrap">
        <a
          href="#"
          className="flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <Image
            className="object-cover w-full h-96 rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
            src="/docs/images/blog/image-4.jpg"
            layout='fill'
            alt=""
          />
          <div className="flex flex-row justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Noteworthy technology acquisitions 2021
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Here are the biggest enterprise technology acquisitions of 2021 so
              far, in reverse chronological order.
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Works;
