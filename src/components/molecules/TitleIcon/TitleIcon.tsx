import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type TitleIconProps = {
  title: string;
  icon: IconProp;
};

const TitleIcon = (props: TitleIconProps) => {
  return (
    <div className="flex items-center space-x-2 mb-10 justify-center md:justify-start">
      <FontAwesomeIcon
        icon={props.icon}
        width={46}
        className="text-indigo-600"
      />
      <h4 className="text-4xl dark:text-white font-medium">{props.title}</h4>
    </div>
  );
};

export default TitleIcon;
