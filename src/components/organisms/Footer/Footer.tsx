import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="overflow-hidden rounded-b-2xl bg-transparent">
      <p className="text-center py-6 text-gray-lite dark:text-color-910">
        © {t("footer")}
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
