
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type HeaderButtonProps = {
  name: string;
  url: string;
  icon: IconDefinition;
  active: Boolean;
};

const HeaderButton = (props: HeaderButtonProps) => {
  const mainClass =
    "flex flex-col items-center mx-2 px-6 py-4 cursor-pointer bg-gray-100 dark:bg-slate-800 rounded-xl";
  let gradientClass =
    " text-slate-800 dark:text-slate-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 hover:text-white transition-all";

  if (props.active) {
    gradientClass =
      " bg-gradient-to-r from-indigo-600 to-blue-500 text-white transition-all";
  }

  return (
    <a href={props.url} className={mainClass + gradientClass}>
      <span className="mb-2">
        <FontAwesomeIcon icon={props.icon} width={14} />
      </span>
      {props.name}
    </a>
  );
};

export default HeaderButton;
