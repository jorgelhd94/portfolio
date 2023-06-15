import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const ButtonCV = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <a
      href={ router.basePath + "/CV_Jorge_Luis_Hernandez.pdf"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-max items-center mx-auto mt-8 bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 px-8 text-lg rounded-full hover:from-blue-500 hover:to-indigo-600"
    >
      <FontAwesomeIcon icon={faFileDownload} width={18} className="mr-3" />
      {t('download')}
    </a>
  );
};

export default ButtonCV;
