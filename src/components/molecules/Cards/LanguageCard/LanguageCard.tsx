import styles from "./LanguageCard.module.css";
import DefaultLink from "../../../atoms/Links/DefaultLink/DefaultLink";

type LanguageType = {
  level: string;
  language: string;
  percent: number;
  icon: string;
  progress?: boolean;
  certificate?: {
    url: string;
    title: string;
  };
};

const LanguageCard = (props: LanguageType) => {
  return (
    <div className="w-full bg-slate-200 dark:bg-transparent mr-7 py-4 pl-5 pr-3 space-y-2 mb-6 rounded-lg dark:border-[#212425] dark:border-2">
      <span className="text-tiny text-indigo-600 dark:text-indigo-300">
        {props.level}
      </span>
      <div className="flex justify-between pt-1 pb-2">
        <h3 className="text-xl dark:text-white">
          <span className="mr-2 align-middle">
            <img src={props.icon} alt="Spanish" width={20} height={20} />
          </span>
          {props.language}
        </h3>
        <h3 className="text-xl dark:text-white"> {props.percent}% </h3>
      </div>
      <div
        className={`relative p-1 w-full sm:w-1/2 bg-indigo-600 rounded ${
          props.progress ? styles.shim : ""
        }`}
        style={{ width: props.percent + "%" }}
      ></div>

      {props.certificate && (
        <div className="pt-2">
          <DefaultLink
            url={props.certificate.url}
            title={props.certificate.title}
          />
        </div>
      )}
    </div>
  );
};

export default LanguageCard;
