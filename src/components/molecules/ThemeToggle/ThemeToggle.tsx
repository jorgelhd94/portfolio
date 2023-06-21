import { SetStateAction, useEffect, useState } from "react";
import { themeChange } from "theme-change";
import "@theme-toggles/react/css/Around.css";
import { Around } from "@theme-toggles/react";

const ThemeToggle = () => {
  const [isToggled, setToggle] = useState(false);
  const [themeName, setThemeName] = useState("dracula");

  useEffect(() => {
    themeChange(false);

    const theme = localStorage.getItem("theme");
    if (!theme) {
      localStorage.setItem("theme", "dracula");
      setThemeName("dracula");
      setToggle(false);
    } else {
      setThemeName(theme === "winter" ? "dracula" : "winter");
      setToggle(theme === "dracula");
    }
  }, []);

  const onChangeTheme = (value: SetStateAction<boolean>) => {
    setThemeName(!value ? "dracula" : "winter");
    setToggle(value);
  };

  return (
    <Around
      duration={750}
      style={{ fontSize: "2rem", width: "3.2rem", height: "3.2rem" }}
      className="btn btn-circle bg-base-100"
      data-set-theme={themeName}
      toggled={isToggled}
      toggle={onChangeTheme}
    />
  );
};

export default ThemeToggle;
