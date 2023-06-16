import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { themeChange } from "theme-change";

const ThemeToggle = () => {
  useEffect(() => {
    themeChange(false);
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "dracula");
    }
  }, []);

  return (
    <div>
      <button
        data-theme="winter"
        className="btn btn-circle text-lg"
        data-set-theme="winter"
        data-act-class="hidden"
      >
        <FontAwesomeIcon icon={faSun} />
      </button>
      <button
        className="btn btn-circle text-lg text-slate-600"
        data-set-theme="dracula"
        data-act-class="hidden"
      >
        <FontAwesomeIcon icon={faMoon} />
      </button>
    </div>
  );
};

export default ThemeToggle;
