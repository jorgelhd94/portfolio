import { MouseEventHandler } from "react";

type LanguageButtonProps = {
  image: string;
  alt: string;
  onClick: MouseEventHandler;
};

const LanguageButton = (props: LanguageButtonProps) => {
  return (
    <div title={props.alt} onClick={props.onClick}>
      <img
        src={props.image}
        alt={props.alt}
        width={55}
        height={55}
        className="cursor-pointer"
      />
    </div>
  );
};

export default LanguageButton;
