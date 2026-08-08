import React from "react";
import { useLanguage, LanguageMode } from "../../../utils/i18n";

const modes: LanguageMode[] = ["system", "id", "en"];

const LanguageSwitcher: React.FC = () => {
  const { mode, setMode, t } = useLanguage();

  const getLabel = (m: LanguageMode) => {
    switch (m) {
      case "system":
        return t.modeSystem;
      case "id":
        return t.modeID;
      case "en":
        return t.modeEN;
    }
  };

  return (
    <div className="relative inline-flex items-center bg-gray-200 dark:bg-gray-700 p-1 rounded-full shadow-inner transition-colors duration-300">
      {modes.map((m) => {
        const isActive = mode === m;
        return (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`relative z-10 px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none ${
              isActive
                ? "text-white shadow-md bg-primary dark:bg-primary"
                : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            }`}
          >
            {getLabel(m)}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;