import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

type WorkTypes = {
  image: StaticImageData;
  title: string;
  urlApp: string;
  urlGithub: string;
  children: React.ReactNode;
};

const WorkCard = (props: WorkTypes) => {
  return (
    <div
      className="max-w-sm bg-slate-200 rounded-lg border border-gray-200 shadow-md
                  dark:bg-gray-800 dark:border-gray-700 mr-4"
    >
      <div className="p-5">
        <div className="flex justify-between">
          <h5 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">
            {props.title}
          </h5>
          <Image src={props.image} alt="app" width={40} height={20} />
        </div>
        <p className="mb-5 font-normal text-gray-700 dark:text-gray-400">
          {props.children}
        </p>
        <div className="flex justify-between">
          <a
            href={props.urlApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex py-2 px-3 text-sm font-medium text-center text-white 
          bg-indigo-600 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300
           dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
          >
            Go to app
            <FontAwesomeIcon icon={faArrowRight} width={12} className="ml-2" />
          </a>
          <a
            href={props.urlGithub}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 text-sm font-medium text-center text-white 
          bg-gray-700 rounded-lg hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-500
           dark:bg-gray-700 dark:hover:bg-gray-900 dark:focus:ring-gray-900"
          >
            <FontAwesomeIcon icon={faGithub} width={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorkCard;
