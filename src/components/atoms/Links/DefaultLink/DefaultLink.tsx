import React from 'react';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type DefaultLinkProps = {
  url: string;
  title: string;
};

const DefaultLink = (props: DefaultLinkProps) => {
  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-slate-900 dark:text-slate-300  hover:text-indigo-600 dark:hover:text-indigo-300"
    >
      {props.title}

      <span>
        <FontAwesomeIcon icon={faExternalLink} width={12} />
      </span>
    </a>
  );
};

export default DefaultLink;
