import React from "react";
import NavbarFooterContainer from "../shared/NavbarFooterContainer";
import { useLanguage } from "../../utils/i18n";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <NavbarFooterContainer>
      <div className="w-full h-full p-4">
        <div className="text-center">
          <p className="mb-2">
            <a href="/" className="hover:underline">
              {t.home}
            </a>{" "}
            |{" "}
            <a href="/about" className="hover:underline">
              {t.about}
            </a>{" "}
            |{" "}
            <a href="/tech" className="hover:underline">
              {t.tech}
            </a>
          </p>
          <p className="text-sm mb-2">
            {t.footerDesc}
          </p>
          <p className="text-sm mb-2">
            © {new Date().getFullYear()} {t.appName}. {t.rightsReserved}.
          </p>
        </div>
      </div>
    </NavbarFooterContainer>
  );
};

export default Footer;
