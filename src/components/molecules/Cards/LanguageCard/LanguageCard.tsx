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
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body mr-7 py-4 pl-5 pr-3">
        <span className="text-tiny text-indigo mb-2">{props.level}</span>
        <div className="flex justify-between pt-1 pb-4">
          <h3 className="flex gap-2">
            <img src={props.icon} alt="Spanish" width={30} height={30} />
            {props.language}
          </h3>
          <h3> {props.percent}% </h3>
        </div>
        <div
          className={`relative p-1 w-full sm:w-1/2 bg-indigo-500 rounded ${
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
    </div>
  );
};

export default LanguageCard;
