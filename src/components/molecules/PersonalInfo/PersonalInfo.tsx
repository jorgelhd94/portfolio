import React from 'react';
import PersonalItem from '../../atoms/PersonalItem/PersonalItem';
import {
  faEnvelope,
  faLocationDot,
  faMobileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "next-i18next";

const PersonalInfo = () => {
  const { t } = useTranslation('common');

  return (
    <div className="p-7 rounded-2xl mt-7 bg-slate-200 dark:bg-[#1D1D1D]">
      <PersonalItem
        icon={faMobileAlt}
        title={t('phone')}
        value="+53 56163564"
        colorIcon="text-cyan-500"
      />
      <hr className="border-[#E3E3E3] dark:border-[#3D3A3A]" />
      <PersonalItem
        icon={faEnvelope}
        title={t('email')}
        value="jorgelhd94@gmail.com"
        colorIcon="text-green-500"
      />
      <hr className="border-[#E3E3E3] dark:border-[#3D3A3A]" />
      <PersonalItem
        icon={faLocationDot}
        title={t('location')}
        value="Ciego de Ávila, Cuba"
        colorIcon="text-red-500"
      />
    </div>
  );
};

export default PersonalInfo;
