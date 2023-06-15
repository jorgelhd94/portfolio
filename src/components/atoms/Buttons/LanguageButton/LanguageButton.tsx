import React, { MouseEventHandler } from 'react';
import Image from 'next/image';

type LanguageButtonProps = {
  image: string;
  alt: string;
  onClick: MouseEventHandler;
};

const LanguageButton = (props: LanguageButtonProps) => {
  return (
    <div className="w-11 h-11" title={props.alt} onClick={props.onClick}>
      <Image
        src={props.image}
        alt={props.alt}
        width={42}
        height={42}
        className="cursor-pointer"
      />
    </div>
  );
};

export default LanguageButton;
