
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type SocialButtonProps = {
  url: string;
  icon: IconDefinition;
  colorClass: string;
};

const SocialButton = (props: SocialButtonProps) => {
  const mainClass =
    " flex text-slate-800 dark:text-slate-300 items-center px-3 py-3 cursor-pointer bg-gray-200 dark:bg-slate-800 rounded-xl";
  let gradientClass =
    " hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 hover:text-white transition-all";

  return (
    <a href={props.url} target="_blank" rel="noopener noreferrer" className={props.colorClass + mainClass + gradientClass}>
      <span>
        <FontAwesomeIcon icon={props.icon} width={16} />
      </span>
    </a>
  );
};

export default SocialButton;
