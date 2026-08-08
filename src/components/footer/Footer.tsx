import React from "react";
import NavbarFooterContainer from "../shared/NavbarFooterContainer";
import { useLanguage } from "../../utils/i18n";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <NavbarFooterContainer>
      <div className="w-full h-full p-4">
        <div className="text-center">
          <p className="mb-2 text-sm font-medium">
            <Link to="/" className="hover:underline text-primary">
              {t.home}
            </Link>{" "}
            |{" "}
            <Link to="/all" className="hover:underline text-primary">
              {(t as Record<string, string>).allList || "All Reading List"}
            </Link>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {t.footerDesc}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} {t.appName}. {t.rightsReserved}.
          </p>
        </div>
      </div>
    </NavbarFooterContainer>
  );
};

export default Footer;
