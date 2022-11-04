import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type SkillButtonProps = {
  name: string;
  url: string;
  icon: IconDefinition;
  colorIcon: string;
};

const SkillButton = (props: SkillButtonProps) => {
  const mainClass =
    " flex text-slate-800 dark:text-slate-300 items-center px-3 py-3 cursor-pointer bg-gray-200 dark:bg-slate-800 rounded-xl mr-2";
  let gradientClass =
    " hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 hover:text-white transition-all";

  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      className={mainClass + gradientClass}
    >
      <span>
        <FontAwesomeIcon
          icon={props.icon}
          width={16}
          className={props.colorIcon}
        />
      </span>

      <p className="ml-2 text-sm">{props.name}</p>
    </a>
  );
};

export default SkillButton;
