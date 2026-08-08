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
    <div className="relative inline-flex items-center bg-slate-200 dark:bg-slate-700/80 p-1 rounded-full shadow-inner transition-colors duration-300 border border-slate-300 dark:border-slate-600">
      {modes.map((m) => {
        const isActive = mode === m;
        return (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`relative z-10 px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-300 ease-in-out focus:outline-none ${
              isActive
                ? "text-white shadow-md bg-primary ring-2 ring-primary/40"
                : "text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
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