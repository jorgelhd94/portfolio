import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type TitleIconProps = {
  title: string;
  icon: IconProp;
};

const TitleIcon = (props: TitleIconProps) => {
  return (
    <div className="flex items-center space-x-2 mb-10 justify-center md:justify-start text-4xl">
      <FontAwesomeIcon icon={props.icon} className="text-indigo-600" />
      <h4 className="text-4xl  font-medium">{props.title}</h4>
    </div>
  );
};

export default TitleIcon;
