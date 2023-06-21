import ButtonCV from "../../atoms/Buttons/ButtonCV/ButtonCV";
import ProfilePhoto from "../../atoms/ProfilePhoto/ProfilePhoto";
import ContactInfo from "../../molecules/PersonalInfo/PersonalInfo";
import SocialLinks from "../../molecules/SocialLinks/SocialLinks";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  return (
    <div className="md:px-0 px-3">
      <div className="w-full mb-6 lg:mb-0 sticky top-44 bg-base-200 text-center  px-6 rounded-[20px] mt-[180px] md:mt-[220px] lg:mt-0">
        <ProfilePhoto />

        <div className="lg:w-80 pt-[100px] pb-8">
          <h2 className="mt-6 mb-1 text-[26px] font-semibold ">
            Jorge Luis Hernández
          </h2>
          <h3 className="card mb-4 bg-base-100 inline-block shadow-md select-none">
            <div className="card-body px-5 py-1.5"> {'< ' + t("profession") + ' />'}</div>
          </h3>

          <SocialLinks />

          <ContactInfo />

          <ButtonCV />
        </div>
      </div>
    </div>
  );
};

export default Profile;
