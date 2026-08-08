import React from "react";
import { useTheme } from "../../utils/ThemeProvider";
import { useLanguage } from "../../utils/i18n";
import Toggle from "../button/toggle/Toggle";
import LanguageSwitcher from "../button/toggle/LanguageSwitcher";
import { icons } from "../../assets/icons";
import NavbarFooterContainer from "../shared/NavbarFooterContainer";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDarkMode = theme === "dark";

  return (
    <NavbarFooterContainer>
      <a
        href="/"
        className="text-2xl sm:text-3xl font-bold text-primary dark:text-textDark-primary transition-colors duration-300"
      >
        {t.appName}
      </a>
      <div className="flex items-center space-x-3 mt-2 sm:mt-0">
        <LanguageSwitcher />
        <Toggle
          label={isDarkMode ? "Dark" : "Light"}
          iconSrc={isDarkMode ? icons.lightBulbOff : icons.lightBulbOn}
          onClick={toggleTheme}
        />
      </div>
    </NavbarFooterContainer>
  );
};

export default Navbar;
