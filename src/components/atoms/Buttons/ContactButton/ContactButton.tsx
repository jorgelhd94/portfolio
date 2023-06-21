
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type ContactButtonProps = {
  icon: IconDefinition;
  colorClass: string;
  colorIcon: string;
};

const ContactButton = (props: ContactButtonProps) => {
  const mainClass =
    " flex items-center px-3 py-3 cursor-pointer rounded-xl shadow-md";
  const gradientClass =
    " hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 hover:text-white transition-all";

  return (
    <div className={props.colorClass + ' ' + props.colorIcon + mainClass + gradientClass}>
      <FontAwesomeIcon icon={props.icon} width={14} />
    </div>
  );
};

export default ContactButton;
