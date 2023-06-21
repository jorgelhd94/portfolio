import { SetStateAction, useEffect, useState } from "react";
import { themeChange } from "theme-change";
import "@theme-toggles/react/css/Around.css";
import { Around } from "@theme-toggles/react";

const ThemeToggle = () => {
  const [isToggled, setToggle] = useState(false);
  const [themeName, setThemeName] = useState("dracula");

  const handleThemeChange = (value: boolean) => {
    setThemeName(value ? "winter" : "dracula");
    setToggle(value);
  };

  useEffect(() => {
    themeChange(false);

    const theme = localStorage.getItem("theme");
    if (!theme) {
      localStorage.setItem("theme", "dracula");
      handleThemeChange(false);
    } else {
      handleThemeChange(theme === "dracula");
    }
  }, []);

  const onChangeTheme = (value: SetStateAction<boolean>) => {
    handleThemeChange(value as boolean);
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
