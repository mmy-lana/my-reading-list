import React, { ReactNode } from "react";

interface NavbarFooterContainerProps {
  children: ReactNode;
}

import { useTheme } from "../../utils/ThemeProvider";

const NavbarFooterContainer: React.FC<NavbarFooterContainerProps> = ({
  children,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`w-full py-4 shadow-sm border-b transition-colors duration-300 ${
        isDark
          ? "bg-slate-900 border-slate-800 text-gray-100"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <div className="w-11/12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        {children}
      </div>
    </div>
  );
};

export default NavbarFooterContainer;