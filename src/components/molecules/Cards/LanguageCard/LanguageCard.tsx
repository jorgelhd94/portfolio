import React from 'react';
import Image, { StaticImageData } from 'next/image';

type LanguageType = {
  level: string;
  language: string;
  percent: number;
  icon: StaticImageData;
};

const LanguageCard = (props: LanguageType) => {
  return (
    <div className="bg-slate-100 dark:bg-transparent mr-7 py-4 pl-5 pr-3 space-y-2 mb-6 rounded-lg dark:border-[#212425] dark:border-2">
      <span className="text-tiny text-gray-lite dark:text-[#b7b7b7]">
        {props.level}
      </span>
      <div className="flex justify-between pt-1 pb-2">
        <h3 className="text-xl dark:text-white">
          <span className="mr-2 align-middle">
            <Image src={props.icon} alt="Spanish" width={20} height={20} />
          </span>
          {props.language}
        </h3>
        <h3 className="text-xl dark:text-white"> {props.percent}% </h3>
      </div>
      <div
        className="bg-indigo-500 h-1 rounded-full p-1"
        style={{ width: props.percent + '%' }}
      ></div>
    </div>
  );
};

export default LanguageCard;
