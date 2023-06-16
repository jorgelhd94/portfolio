type EducationType = {
  period: string;
  title: string;
  institution: string;
};

const EducationCard = (props: EducationType) => {
  return (
    <div className="card shadow-xl w-full bg-base-100">
      <div className="card-body mr-7 py-4 pl-5 pr-3 space-y-2">
        <span className="text-tiny text-gray-lite ">{props.period}</span>
        <h3 className="text-xl text-indigo "> {props.title} </h3>
        <p> {props.institution} </p>
      </div>
    </div>
  );
};

export default EducationCard;
