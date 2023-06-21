import { MouseEventHandler, forwardRef, ForwardedRef } from "react";

type LanguageButtonProps = {
  image: string;
  alt: string;
  onClick: MouseEventHandler;
};

const LanguageButton = forwardRef(
  (
    { image, alt, onClick }: LanguageButtonProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div ref={ref} title={alt} onClick={onClick}>
        <img
          src={image}
          alt={alt}
          width={55}
          height={55}
          className="cursor-pointer"
        />
      </div>
    );
  }
);

export default LanguageButton;
