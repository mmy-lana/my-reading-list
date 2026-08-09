import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WaitingAssetsLoaderProps {
  isLoading: boolean;
  onFinish?: () => void;
}

export const WaitingAssetsLoader: React.FC<WaitingAssetsLoaderProps> = ({
  isLoading,
  onFinish,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Force scroll position to top on initial load
    window.scrollTo(0, 0);

    // Completely block wheel/touch/keyboard scrolling while loading
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener(
      "keydown",
      (e) => {
        if (
          ["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.code)
        ) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 12;
      });
    }, 120);

    return () => {
      clearInterval(interval);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!isLoading && progress >= 100) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (onFinish) onFinish();
    }
  }, [isLoading, progress, onFinish]);

  const active = isLoading || progress < 100;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white select-none touch-none overscroll-none"
        >
          <div className="relative flex flex-col items-center gap-6 max-w-sm w-full px-6 text-center">
            {/* Spinning Emblem */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xl shadow-[0_0_25px_rgba(139,92,246,0.6)]">
                M1
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black tracking-wider uppercase text-white">
                Preparing Monoliths
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Loading 3D canvas assets & dataset...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            <span className="text-xs font-mono font-bold text-purple-400">
              {Math.min(progress, 100)}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaitingAssetsLoader;