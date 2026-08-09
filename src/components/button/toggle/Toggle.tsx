// Toggle.tsx
import React from "react";

interface ToggleProps {
  label: string; // Label for the toggle
  iconSrc: string; // Path to the icon
  onClick: () => void; // Callback for toggle action
}

const Toggle: React.FC<ToggleProps> = ({ label, iconSrc, onClick }) => {
  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      {/* Label next to the toggle (hidden on small screens to save vertical space) */}
      <span className="hidden sm:inline text-xs sm:text-sm font-medium">{label}</span>

      {/* Toggle Button */}
      <button
        onClick={onClick}
        className="flex items-center justify-center p-1.5 sm:p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-all hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none"
        aria-label={`Switch to ${label === "Dark" ? "Light" : "Dark"} Mode`}
      >
        <img
          src={iconSrc}
          alt="toggle icon"
          className="w-4 h-4 sm:w-6 sm:h-6 transition-all duration-300"
        />
      </button>
    </div>
  );
};

export default Toggle;
