import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const GithubButton = (props: { urlGithub: string }) => {
  return (
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
  );
};

export default GithubButton;
