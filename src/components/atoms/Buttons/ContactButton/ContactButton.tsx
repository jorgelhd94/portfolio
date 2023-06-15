
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type ContactButtonProps = {
  icon: IconDefinition;
  colorClass: string;
  colorIcon: string;
};

const ContactButton = (props: ContactButtonProps) => {
  const mainClass =
    " flex items-center px-3 py-3 cursor-pointer bg-gray-100 dark:bg-slate-800 rounded-xl shadow-md";
  let gradientClass =
    " hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 hover:text-white transition-all";

  return (
    <span className={props.colorClass + ' ' + props.colorIcon + mainClass + gradientClass}>
      <FontAwesomeIcon icon={props.icon} width={14} />
    </span>
  );
};

export default ContactButton;
