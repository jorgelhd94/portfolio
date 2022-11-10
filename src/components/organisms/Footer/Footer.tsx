import React from "react";

const Footer = () => {
  return (
    <footer
      className="overflow-hidden rounded-b-2xl bg-transparent"
    >
      <p className="text-center py-6 text-gray-lite dark:text-color-910">
        © 2022 All Rights Reserved by
        <a
          className="hover:text-indigo-400 ml-2 duration-300 transition"
          href="https://github.com/jorgelhd94"
          target="_blank"
          rel="noopener noreferrer"
        >
          JCode
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;
