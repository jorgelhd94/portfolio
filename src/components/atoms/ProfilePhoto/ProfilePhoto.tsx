import Image from "next/image";
import React from "react";
import Avatar from "../../../../public/profile.jpeg"

const ProfilePhoto = () => {
  return (
    <div className="w-[200px] absolute left-[50%] transform -translate-x-[50%] drop-shadow-xl mx-auto -mt-[140px]">
      <Image src={Avatar} alt="about" className="rounded-[20px]"/>
    </div>
  );
};

export default ProfilePhoto;
