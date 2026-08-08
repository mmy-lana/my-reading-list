import React, { useState } from "react";
import { ComicItem } from "../../services/firebase";
import StarRating from "../shared/StarRating";
import { useTheme } from "../../utils/ThemeProvider";

interface DingoLastReadCardProps {
  item: ComicItem;
  index: number;
  onClick: () => void;
}

function getFallbackCoverSvg(title: string): string {
  const safeTitle = (title || "Manga").substring(0, 24);
  const encodedTitle = encodeURIComponent(safeTitle);
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="50%" stop-color="%234338ca"/><stop offset="100%" stop-color="%23d946ef"/></linearGradient></defs><rect width="300" height="450" fill="url(%23g)"/><circle cx="150" cy="180" r="70" fill="%23ffffff" opacity="0.1"/><text x="150" y="230" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23ffffff" text-anchor="middle">${encodedTitle}</text><text x="150" y="260" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23f472b6" text-anchor="middle">M1YUKI READ</text></svg>`;
}

export const DingoLastReadCard: React.FC<DingoLastReadCardProps> = ({
  item,
  index,
  onClick,
}) => {
  const { isDark } = useTheme();
  const fallbackSvg = getFallbackCoverSvg(item.title);
  const [imgSrc, setImgSrc] = useState(item.img && item.img.trim() !== "" ? item.img : fallbackSvg);

  return (
    <div
      onClick={onClick}
      className="group relative w-full max-w-[210px] aspect-[2/3.4] rounded-2xl p-[2px] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer overflow-hidden shadow-lg hover:shadow-primary/30"
    >
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-30 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-500 animate-pulse" />

      <div className={`relative h-full w-full rounded-2xl backdrop-blur-md p-2.5 flex flex-col justify-between border ${
        isDark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-gray-200"
      }`}>
        <div className={`relative w-full aspect-[2/2.7] overflow-hidden rounded-xl ${
          isDark ? "bg-slate-800" : "bg-gray-100"
        }`}>
          <img
            src={imgSrc}
            alt={item.title}
            onError={() => setImgSrc(fallbackSvg)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <span className="absolute top-2 left-2 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide rounded-full bg-primary text-white shadow-md">
            Ch. {item.chapter}
          </span>

          <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-md bg-black/60 text-white backdrop-blur-md border border-white/10">
            {item.status}
          </span>
        </div>

        <div className="mt-2.5 flex flex-col justify-between flex-1">
          <div>
            <h3 className={`font-bold text-xs line-clamp-2 leading-tight group-hover:text-primary transition-colors ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              {item.title}
            </h3>
            <p className={`text-[10px] mt-1 truncate ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              {item.myOpinion || "Recently Updated"}
            </p>
          </div>

          <div className={`pt-2 border-t flex items-center justify-between ${
            isDark ? "border-slate-800" : "border-gray-200"
          }`}>
            <StarRating score={item.rating} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DingoLastReadCard;