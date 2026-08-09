import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ComicItem } from "../../services/firebase";
import DingoLastReadCard from "../../components/card/DingoLastReadCard";
import { useTheme } from "../../utils/ThemeProvider";

interface LastReadSectionProps {
  lastReadData: ComicItem[];
  onCardClick: (item: ComicItem) => void;
}

export const LastReadSection: React.FC<LastReadSectionProps> = ({
  lastReadData,
  onCardClick,
}) => {
  const { isDark } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const xTranslate = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <div ref={sectionRef} className={`relative py-16 overflow-hidden transition-colors duration-300 border-t ${
      isDark ? "bg-slate-950 border-slate-900 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
    }`}>
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-primary">
          Last Read Activity
        </h2>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Parallax stream of your most recently updated progress
        </p>
      </div>

      <motion.div style={{ x: xTranslate }} className="flex gap-6 w-max px-8">
        {lastReadData.map((item, index) => (
          <motion.div
            key={item.id || index}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <DingoLastReadCard
              item={item}
              index={index}
              onClick={() => onCardClick(item)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LastReadSection;