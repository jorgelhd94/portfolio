import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type PrimaryIconButtonProps = {
    urlApp: string,
    text: string,
    icon: IconDefinition
}

const PrimaryIconButton = (props: PrimaryIconButtonProps) => {
  return (
    <a
      href={props.urlApp}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex py-2 px-3 text-sm font-medium text-center text-white 
          bg-indigo-600 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300
           dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
    >
      {props.text}
      <FontAwesomeIcon icon={props.icon} width={12} className="ml-2" />
    </a>
  );
};

export default PrimaryIconButton;
