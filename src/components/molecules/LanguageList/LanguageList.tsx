import { Language } from '../../../interfaces/Language';
import LanguageListItem from '../../atoms/LanguageListItem/LanguageListItem';

type LanguageListProps = {
  languages: Language[];
  // eslint-disable-next-line no-unused-vars
  onClickItem: (code: string) => void;
};

const LanguageList = (props: LanguageListProps) => {
  const listLanguages = props.languages.map((lang) => (
    <LanguageListItem
      language={lang}
      key={lang.code}
      onClick={() => props.onClickItem(lang.code)}
    />
  ));
  return <div className="flex flex-col space-y-2 py-1">{listLanguages}</div>;
};

export default LanguageList;
