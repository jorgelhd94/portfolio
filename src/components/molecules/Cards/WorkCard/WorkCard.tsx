import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "next-i18next";
import GithubButton from '../../../atoms/Buttons/GithubButton/GithubButton';
import PrimaryIconButton from '../../../atoms/Buttons/PrimaryButton/PrimaryIconButton';

type WorkTypes = {
  image: StaticImageData;
  title: string;
  urlApp: string;
  urlGithub: string;
  children: React.ReactNode;
};

const WorkCard = (props: WorkTypes) => {
  const { t } = useTranslation('common');

  return (
    <div
      className="flex w-full md:max-w-sm justify-center bg-slate-200 rounded-lg border border-gray-200 shadow-md
                  dark:bg-gray-800 dark:border-gray-700 mr-4 mb-4"
    >
      <div className="p-5 flex flex-col justify-between">
  
        <div className="flex justify-between">
          <h5 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">
            {props.title}
          </h5>
          <Image src={props.image} alt="app" width={40} height={20} />
        </div>

        <p className="mb-5 font-normal text-gray-700 dark:text-gray-400">
          {props.children}
        </p>
  
        <div className="flex justify-between">
          <PrimaryIconButton urlApp={props.urlApp} text={t('go_app')} icon={faArrowRight}/>
          <GithubButton urlGithub={props.urlGithub}/>
        </div>

      </div>
    </div>
  );
};

export default WorkCard;
