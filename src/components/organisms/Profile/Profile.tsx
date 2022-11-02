import React from "react";
import ButtonCV from "../../atoms/ButtonCV/ButtonCV";
import ProfilePhoto from "../../atoms/ProfilePhoto/ProfilePhoto";
import ContactInfo from "../../molecules/PersonalInfo/PersonalInfo";
import SocialLinks from "../../molecules/SocialLinks/SocialLinks";

const Profile = () => {
  return (
    <div className="col-span-12 lg:col-span-4 lg:block">
      <div className="w-[90%] mb-6 lg:mb-0 mx-auto sticky top-44 bg-white text-center dark:bg-[#111111] px-6 rounded-[20px] mt-[180px] md:mt-[220px] lg:mt-0">
        <ProfilePhoto />

        <div className="pt-[100px] pb-8">
          <h2 className="mt-6 mb-1 text-[26px] font-semibold dark:text-white">
            Jorge Luis Hernández
          </h2>
          <h3 className="mb-4 text-[#7B7B7B] inline-block dark:bg-[#1D1D1D] px-5 py-1.5 rounded-lg dark:text-[#A6A6A6]">
            Software Developer
          </h3>

          <SocialLinks/>

          <ContactInfo/>

          <ButtonCV />
        </div>
      </div>
    </div>
  );
};

export default Profile;
