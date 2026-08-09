import React, { useState } from "react";
import { useTheme } from "../../utils/ThemeProvider";
import { useLanguage } from "../../utils/i18n";
import Toggle from "../button/toggle/Toggle";
import LanguageSwitcher from "../button/toggle/LanguageSwitcher";
import { icons } from "../../assets/icons";
import NavbarFooterContainer from "../shared/NavbarFooterContainer";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const isDarkMode = theme === "dark";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <NavbarFooterContainer>
      <div className="w-full flex flex-col">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between w-full">
          {/* Title */}
          <Link
            to="/"
            className="text-base sm:text-2xl font-black text-primary dark:text-textDark-primary transition-colors duration-300 tracking-tight shrink-0"
          >
            {t.appName}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold">
            <Link
              to="/"
              className={`transition-colors ${
                location.pathname === "/"
                  ? "text-primary border-b-2 border-primary font-bold"
                  : "text-gray-800 dark:text-slate-200 hover:text-primary dark:hover:text-primary"
              }`}
            >
              {t.home}
            </Link>
            <Link
              to="/all"
              className={`transition-colors ${
                location.pathname === "/all"
                  ? "text-primary border-b-2 border-primary font-bold"
                  : "text-gray-800 dark:text-slate-200 hover:text-primary dark:hover:text-primary"
              }`}
            >
              {(t as Record<string, string>).allList || "All Reading List"}
            </Link>
          </nav>

          {/* Right Controls: [ Language ] • [ Theme Toggle ] • [ Burger Button ] */}
          <div className="flex items-center gap-1.5 sm:gap-3 scale-90 sm:scale-100 origin-right">
            <LanguageSwitcher />
            <Toggle
              label={isDarkMode ? "Dark" : "Light"}
              iconSrc={isDarkMode ? icons.lightBulbOff : icons.lightBulbOn}
              onClick={toggleTheme}
            />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Mobile Navigation"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="sm:hidden w-full overflow-hidden border-t border-slate-200 dark:border-slate-800 mt-2.5 pt-2"
            >
              <nav className="flex flex-col gap-1.5 py-1 text-sm font-bold">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    location.pathname === "/"
                      ? "bg-primary/10 text-primary"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {t.home}
                </Link>
                <Link
                  to="/all"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    location.pathname === "/all"
                      ? "bg-primary/10 text-primary"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {(t as Record<string, string>).allList || "All Reading List"}
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </NavbarFooterContainer>
  );
};

export default Navbar;
