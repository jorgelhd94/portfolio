import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type SocialButtonProps = {
  url: string;
  icon: IconDefinition;
  colorClass: string;
};

const SocialButton = (props: SocialButtonProps) => {
  const mainClass =
    " flex text-base-300 items-center px-3 py-2 cursor-pointer bg-base-content rounded-xl";
  const gradientClass =
    " hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 hover:text-white transition-all";

  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      className={props.colorClass + mainClass + gradientClass}
    >
      <span>
        <FontAwesomeIcon icon={props.icon} />
      </span>
    </a>
  );
};

export default SocialButton;
