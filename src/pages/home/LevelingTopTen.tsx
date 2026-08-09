import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ComicItem } from "../../services/firebase";
import EvervaultTopTenCard from "../../components/card/EvervaultTopTenCard";
import { useTheme } from "../../utils/ThemeProvider";

interface LevelingTopTenProps {
  topTenData: ComicItem[];
  onCardClick: (item: ComicItem) => void;
}

export const LevelingTopTen: React.FC<LevelingTopTenProps> = ({
  topTenData,
  onCardClick,
}) => {
  const { isDark } = useTheme();
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Step 1: Monarch #1 scrubs in on scroll (0.02 -> 0.18)
  const row1Y = useTransform(scrollYProgress, [0.02, 0.18], [35, 0]);
  const row1Opacity = useTransform(scrollYProgress, [0.02, 0.15], [0, 1]);

  // Step 2: Guards #2 & #3 scrub in on scroll (0.18 -> 0.38)
  const row2Y = useTransform(scrollYProgress, [0.18, 0.38], [35, 0]);
  const row2Opacity = useTransform(scrollYProgress, [0.18, 0.32], [0, 1]);

  // Step 3: Row 3 (#4, #5, #6) scrubs in on scroll (0.38 -> 0.58)
  const row3Y = useTransform(scrollYProgress, [0.38, 0.58], [35, 0]);
  const row3Opacity = useTransform(scrollYProgress, [0.38, 0.52], [0, 1]);

  // Step 4: Row 4 (#7, #8, #9, #10) scrubs in on scroll (0.58 -> 0.78)
  const row4Y = useTransform(scrollYProgress, [0.58, 0.78], [35, 0]);
  const row4Opacity = useTransform(scrollYProgress, [0.58, 0.72], [0, 1]);

  // HOLD PHASE (0.70 -> 0.92): All 10 cards stay 100% visible on screen while scrolling

  const row1Item = topTenData[0];
  const row2Items = topTenData.slice(1, 3);
  const row3Items = topTenData.slice(3, 6);
  const row4Items = topTenData.slice(6, 10);

  return (
    <div ref={targetRef} className={`relative h-[220vh] w-full transition-colors duration-300 ${
      isDark ? "bg-slate-950" : "bg-gray-50"
    }`}>
      <div
        className={`sticky top-0 h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden transition-colors duration-300 ${
          isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* Background Glow */}
        <div className={`absolute inset-0 pointer-events-none ${
          isDark
            ? "bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18)_0,transparent_75%)]"
            : "bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0,transparent_75%)]"
        }`} />

        <div className="relative z-10 text-center mb-1 shrink-0">
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-primary">
            Top 10 Monoliths
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            The highest-rated titles in the hall of fame
          </p>
        </div>

        {/* Scaled 1-2-3-4 Pyramid Layout Centered in Viewport */}
        <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center z-20 gap-0 scale-[0.45] xs:scale-[0.52] sm:scale-[0.60] md:scale-[0.68] lg:scale-[0.75] origin-center my-auto">
          {/* ROW 1: MONARCH #1 */}
          {row1Item && (
            <motion.div
              style={{ y: row1Y, opacity: row1Opacity }}
              className="relative z-40 flex flex-col items-center shrink-0 mb-1"
            >
              <div className="mb-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/40 animate-bounce">
                👑 Monarch #1
              </div>
              <div className="ring-2 ring-primary rounded-2xl shadow-xl">
                <EvervaultTopTenCard
                  item={row1Item}
                  index={0}
                  onClick={() => onCardClick(row1Item)}
                />
              </div>
            </motion.div>
          )}

          {/* ROW 2: GUARDS #2 & #3 */}
          <motion.div
            style={{ y: row2Y, opacity: row2Opacity }}
            className="flex justify-center gap-3 sm:gap-6 w-full z-30 shrink-0 -mt-2"
          >
            {row2Items.map((item, idx) => (
              <div key={item.id || idx} className="relative">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-primary text-white font-black text-[9px] shadow-lg z-20">
                  Guard #{idx + 2}
                </span>
                <EvervaultTopTenCard
                  item={item}
                  index={idx + 1}
                  onClick={() => onCardClick(item)}
                />
              </div>
            ))}
          </motion.div>

          {/* ROW 3: COURT (#4, #5, #6) */}
          <motion.div
            style={{ y: row3Y, opacity: row3Opacity }}
            className="flex justify-center gap-2 sm:gap-4 w-full z-20 shrink-0 -mt-2"
          >
            {row3Items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="hover:scale-105 transition-transform duration-200"
              >
                <EvervaultTopTenCard
                  item={item}
                  index={idx + 3}
                  onClick={() => onCardClick(item)}
                />
              </div>
            ))}
          </motion.div>

          {/* ROW 4: COURT (#7, #8, #9, #10) */}
          <motion.div
            style={{ y: row4Y, opacity: row4Opacity }}
            className="flex justify-center gap-1.5 sm:gap-3 w-full z-10 shrink-0 -mt-2"
          >
            {row4Items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="hover:scale-105 transition-transform duration-200"
              >
                <EvervaultTopTenCard
                  item={item}
                  index={idx + 6}
                  onClick={() => onCardClick(item)}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LevelingTopTen;