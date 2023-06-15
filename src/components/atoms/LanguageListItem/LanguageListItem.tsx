import React, { MouseEventHandler } from 'react';
import { ILanguage } from '../../../interfaces/ILanguage';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

type LanguageListItemProps = {
  language: ILanguage;
  onClick: MouseEventHandler;
};

const LanguageListItem = (props: LanguageListItemProps) => {
  const router = useRouter();
  let href = router.asPath;
  let pName = router.pathname;
  const languageCode = props.language.code;

  Object.keys(router.query).forEach((k) => {
    if (k === 'locale') {
      pName = pName.replace(`[${k}]`, languageCode);
      return;
    }
    const query = (router.query[k] as string) || '';
    pName = pName.replace(`[${k}]`, query);
  });

  if (languageCode) {
    href = pName;
  }

  return (
    <Link href={href}>
      <div
        onClick={props.onClick}
        className="flex space-x-4 px-2 py-1 cursor-pointer hover:bg-indigo-500 text-black hover:text-white"
      >
        <Image
          src={props.language.src}
          width={24}
          height={24}
          alt={props.language.alt}
        />
        <p>{props.language.alt}</p>
      </div>
    </Link>
  );
};

export default LanguageListItem;
