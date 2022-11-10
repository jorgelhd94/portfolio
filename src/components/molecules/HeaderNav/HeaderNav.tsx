import React from "react";
import HeaderButton from "../../atoms/Buttons/HeaderButton/HeaderButton";
import { faUser, faCode, faBriefcase } from "@fortawesome/free-solid-svg-icons";

const HeaderNav = () => {
  return (
    <nav>
      <ul className="flex justify-between">
        <li>
            <HeaderButton active={true} icon={faUser} name="About" url="#" />
        </li>
        <li>
            <HeaderButton active={false} icon={faCode} name="Skills" url="#" />
        </li>
        <li>
            <HeaderButton active={false} icon={faBriefcase} name="Works" url="#" />
        </li>
      </ul>
    </nav>
  );
};

export default HeaderNav;
