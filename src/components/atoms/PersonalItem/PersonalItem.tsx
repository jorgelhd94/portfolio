import React from "react";
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
      <ContactButton icon={props.icon} colorClass="bg-white" colorIcon={props.colorIcon} />
      <div className="text-left ml-2.5">
        <p className="text-xs text-[#44566C] dark:text-[#A6A6A6]">
          {props.title}
        </p>
        <p className="dark:text-white">{props.value}</p>
      </div>
    </div>
  );
};

export default PersonalItem;
