import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

const ButtonCV = () => {
  const { t } = useTranslation();

  return (
    <a
      href="/CV_Jorge_Luis_Hernandez.pdf"
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
