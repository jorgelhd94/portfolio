

type EducationType = {
  period: string;
  title: string;
  institution: string;
};

const EducationCard = (props: EducationType) => {
  return (
    <div className="w-full bg-slate-200 dark:bg-transparent mr-7 py-4 pl-5 pr-3 space-y-2 mb-6 rounded-lg dark:border-[#212425] dark:border-2">
      <span className="text-tiny text-gray-lite dark:text-[#b7b7b7]">
        {props.period}
      </span>
      <h3 className="text-xl text-indigo-600 dark:text-indigo-300"> {props.title} </h3>
      <p className="dark:text-[#b7b7b7]"> {props.institution} </p>
    </div>
  );
};

export default EducationCard;
