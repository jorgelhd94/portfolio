import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./SkillButton.module.css";

type SkillButtonProps = {
  name: string;
  url: string;
  icon: IconDefinition;
  colorIcon: string;
};

const SkillButton = (props: SkillButtonProps) => {
  const mainClass =
    " flex items-center px-3 py-3 cursor-pointer bg-slate-800 rounded-xl mr-2 mt-2 hover:text-white";
  const gradientClass =
    " hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 transition-all ";

  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.text + mainClass + gradientClass + props.colorIcon}
    >
      <span>
        <FontAwesomeIcon icon={props.icon} width={16} />
      </span>

      <p className="ml-2 text-sm text-white">{props.name}</p>
    </a>
  );
};

export default SkillButton;
