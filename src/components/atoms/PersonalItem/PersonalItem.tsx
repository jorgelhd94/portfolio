
import ContactButton from "../Buttons/ContactButton/ContactButton";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type PersonalItemProps = {
  icon: IconDefinition;
  colorIcon: string;
  title: string;
  value: string;
};

const PersonalItem = (props: PersonalItemProps) => {
  return (
    <div className="flex px-2.5 py-4">
      <ContactButton colorClass="bg-base-100" icon={props.icon} colorIcon={props.colorIcon} />
      <div className="text-left ml-2.5">
        <p className="text-xs">
          {props.title}
        </p>
        <p>{props.value}</p>
      </div>
    </div>
  );
};

export default PersonalItem;
