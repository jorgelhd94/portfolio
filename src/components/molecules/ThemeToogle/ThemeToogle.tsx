import React from "react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const ThemeToogle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const changeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => changeTheme()}
        className="focus:outline-none md:bg-white bg-gray-200 dark:bg-gray-500 w-12 h-12 rounded-full
                      hover:text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 flex items-center justify-center"
      >
        {theme === "light" ? (
          <FontAwesomeIcon icon={faMoon} width={18}  />
        ) : (
          <FontAwesomeIcon icon={faSun} width={24} />
        )}
      </button>
    </div>
  );
};

export default ThemeToogle;
