import PersonalItem from "../../atoms/PersonalItem/PersonalItem";
import {
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const PersonalInfo = () => {
  const { t } = useTranslation();

  return (
    <div className="p-7 rounded-2xl mt-7 bg-base-300">
      {/* <PersonalItem
        icon={faMobileAlt}
        title={t("phone")}
        value="+53 56163564"
        colorIcon="text-cyan-500"
      /> */}
      <PersonalItem
        icon={faEnvelope}
        title={t("email")}
        value="jorgelhd94@gmail.com"
        colorIcon="text-green-500"
      />
      <PersonalItem
        icon={faLocationDot}
        title={t("location")}
        value="Habana, Cuba"
        colorIcon="text-red-500"
      />
    </div>
  );
};

export default PersonalInfo;
