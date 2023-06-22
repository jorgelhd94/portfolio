import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import style from "./SocialButton.module.css";

type SocialButtonProps = {
  url: string;
  icon: IconDefinition;
  colorClass: string;
};

const SocialButton = (props: SocialButtonProps) => {
  const mainClass =
    " flex items-center px-3 py-2 cursor-pointer bg-base-100 rounded-xl shadow-md";
  const gradientClass =
    " hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 hover:text-white transition-all ";

  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      className={props.colorClass + mainClass + gradientClass + style.linkStyle}
    >
      <span className="text-base-content">
        <FontAwesomeIcon icon={props.icon} />
      </span>
    </a>
  );
};

export default SocialButton;
