import React, { ReactNode } from "react";

interface NavbarFooterContainerProps {
  children: ReactNode;
}

const NavbarFooterContainer: React.FC<NavbarFooterContainerProps> = ({
  children,
}) => {
  return (
    <div className="w-full text-text-primary dark:text-textDark-primary py-4 shadow-sm bg-white dark:bg-backgroundDark-secondary border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="w-11/12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        {children}
      </div>
    </div>
  );
};

export default NavbarFooterContainer;