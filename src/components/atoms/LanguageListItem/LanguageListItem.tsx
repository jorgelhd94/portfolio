import { MouseEventHandler } from "react";
import { Language } from "../../../interfaces/Language";

type LanguageListItemProps = {
  language: Language;
  onClick: MouseEventHandler;
};

const LanguageListItem = (props: LanguageListItemProps) => {
  return (
    <div
      onClick={props.onClick}
      className="flex space-x-4 px-2 py-1 cursor-pointer hover:bg-indigo-500 text-black hover:text-white"
    >
      <img
        src={props.language.src}
        width={24}
        height={24}
        alt={props.language.alt}
      />
      <p>{props.language.alt}</p>
    </div>
  );
};

export default LanguageListItem;
