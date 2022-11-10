import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ButtonCV = () => {
  return (
    <a
      href="cv.pdf" target="_blank" rel="noopener noreferrer"
      className="flex w-max items-center mx-auto mt-8 bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 px-8 text-lg rounded-full hover:from-blue-500 hover:to-indigo-600"
    >
      <FontAwesomeIcon icon={faFileDownload} width={18} className="mr-3" />
      Download CV
    </a>
  );
};

export default ButtonCV;
