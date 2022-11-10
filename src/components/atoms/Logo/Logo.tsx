import React from "react";
import Image from "next/image";
import LogoImage from "../../../../public/logo.png";

const Logo = () => {
  return (
    <>
      <Image src={LogoImage} alt="Logo" width={160} height={40}/>
    </>
  );
};

export default Logo;
