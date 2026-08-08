import React from "react";
import { useTheme } from "../../utils/ThemeProvider";
import { useLanguage } from "../../utils/i18n";
import Toggle from "../button/toggle/Toggle";
import LanguageSwitcher from "../button/toggle/LanguageSwitcher";
import { icons } from "../../assets/icons";
import NavbarFooterContainer from "../shared/NavbarFooterContainer";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const isDarkMode = theme === "dark";

  return (
    <NavbarFooterContainer>
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-bold text-primary dark:text-textDark-primary transition-colors duration-300"
          >
            {t.appName}
          </Link>

          <nav className="flex items-center gap-4 text-sm font-semibold">
            <Link
              to="/"
              className={`transition-colors ${
                location.pathname === "/"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-800 dark:text-slate-200 hover:text-primary dark:hover:text-primary"
              }`}
            >
              {t.home}
            </Link>
            <Link
              to="/all"
              className={`transition-colors ${
                location.pathname === "/all"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-800 dark:text-slate-200 hover:text-primary dark:hover:text-primary"
              }`}
            >
              {(t as Record<string, string>).allList || "All Reading List"}
            </Link>
            <Link
              to="/admin"
              className={`transition-colors ${
                location.pathname === "/admin"
                  ? "text-primary border-b-2 border-primary"
                  : "text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary"
              }`}
            >
              Admin
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageSwitcher />
          <Toggle
            label={isDarkMode ? "Dark" : "Light"}
            iconSrc={isDarkMode ? icons.lightBulbOff : icons.lightBulbOn}
            onClick={toggleTheme}
          />
        </div>
      </div>
    </NavbarFooterContainer>
  );
};

export default Navbar;
