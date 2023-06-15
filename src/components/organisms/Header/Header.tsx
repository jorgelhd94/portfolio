import React from "react";
import HeaderNav from "../../molecules/HeaderNav/HeaderNav";

const Header = () => {
  return (
    <div className="lg:w-[480px] h-[133px] hidden lg:block px-[30px] py-[25px] ml-auto mb-10 rounded-[16px] bg-white dark:bg-black">
      <HeaderNav />
    </div>
  );
};

export default Header;
