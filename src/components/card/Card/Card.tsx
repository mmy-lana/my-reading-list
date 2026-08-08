import React, { forwardRef, useState } from "react";
import StarRating from "../../shared/StarRating";

interface CardProps {
  index?: number;
  img: string;
  title: string;
  chapter: number;
  score: number;
  status: string;
  onClick(): void;
}

function getFallbackCoverSvg(title: string): string {
  const safeTitle = (title || "Manga").substring(0, 24);
  const encodedTitle = encodeURIComponent(safeTitle);
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="50%" stop-color="%234338ca"/><stop offset="100%" stop-color="%23d946ef"/></linearGradient></defs><rect width="300" height="450" fill="url(%23g)"/><circle cx="150" cy="180" r="70" fill="%23ffffff" opacity="0.1"/><text x="150" y="230" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23ffffff" text-anchor="middle">${encodedTitle}</text><text x="150" y="260" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23f472b6" text-anchor="middle">M1YUKI READ</text></svg>`;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ img, title, chapter, score, status, onClick, index = 0 }, ref) => {
    const fallbackSvg = getFallbackCoverSvg(title);
    const [imgSrc, setImgSrc] = useState(img && img.trim() !== "" ? img : fallbackSvg);

    const getRankBadge = (idx: number) => {
      if (idx === 0) return "bg-amber-400 text-black font-bold";
      if (idx === 1) return "bg-gray-300 text-black font-bold";
      if (idx === 2) return "bg-amber-700 text-white font-bold";
      return "bg-gray-700/80 text-white";
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className="group relative w-full max-w-[210px] bg-white dark:bg-backgroundDark-secondary rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
      >
        <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={imgSrc}
            alt={title}
            onError={() => setImgSrc(fallbackSvg)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full bg-black/60 text-white backdrop-blur-md shadow">
            {status}
          </span>

          {index < 3 && (
            <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-xs rounded-md shadow ${getRankBadge(index)}`}>
              #{index + 1}
            </span>
          )}
        </div>

        <div className="p-3.5 flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
              Chapter {chapter}
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
            <StarRating score={score} />
          </div>
        </div>
      </div>
    );
  }
);

export default Card;
