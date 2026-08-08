import React, { useState } from "react";
import { ComicItem } from "../../services/firebase";
import StarRating from "../shared/StarRating";

interface InfiniteMovingNewTitlesProps {
  items: ComicItem[];
  speed?: "fast" | "normal" | "slow";
  onCardClick: (item: ComicItem) => void;
}

function getFallbackCoverSvg(title: string): string {
  const safeTitle = (title || "Manga").substring(0, 24);
  const encodedTitle = encodeURIComponent(safeTitle);
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="50%" stop-color="%234338ca"/><stop offset="100%" stop-color="%23d946ef"/></linearGradient></defs><rect width="300" height="450" fill="url(%23g)"/><circle cx="150" cy="180" r="70" fill="%23ffffff" opacity="0.1"/><text x="150" y="230" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23ffffff" text-anchor="middle">${encodedTitle}</text><text x="150" y="260" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23f472b6" text-anchor="middle">M1YUKI READ</text></svg>`;
}

const MarqueeCard: React.FC<{ item: ComicItem; onClick: () => void }> = ({ item, onClick }) => {
  const fallbackSvg = getFallbackCoverSvg(item.title);
  const [imgSrc, setImgSrc] = useState(item.img && item.img.trim() !== "" ? item.img : fallbackSvg);

  return (
    <div
      onClick={onClick}
      className="group relative w-[180px] shrink-0 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2.5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      <div className="relative w-full aspect-[2/2.7] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <img
          src={imgSrc}
          alt={item.title}
          onError={() => setImgSrc(fallbackSvg)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-black/70 text-white backdrop-blur-md">
          {item.status}
        </span>
      </div>

      <div className="mt-2.5 flex flex-col justify-between">
        <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
          {item.title}
        </h4>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
          Chapter {item.chapter}
        </p>

        <div className="mt-2 pt-1.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <StarRating score={item.rating} />
        </div>
      </div>
    </div>
  );
};

export const InfiniteMovingNewTitles: React.FC<InfiniteMovingNewTitlesProps> = ({
  items,
  speed = "normal",
  onCardClick,
}) => {
  const speedDuration = speed === "fast" ? "20s" : speed === "slow" ? "50s" : "35s";
  const displayItems = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-4 group">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background dark:from-backgroundDark to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background dark:from-backgroundDark to-transparent" />

      <div
        className="flex min-w-full shrink-0 gap-4 w-max flex-nowrap animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: speedDuration }}
      >
        {displayItems.map((item, idx) => (
          <MarqueeCard key={`${item.id}-${idx}`} item={item} onClick={() => onCardClick(item)} />
        ))}
      </div>
    </div>
  );
};

export default InfiniteMovingNewTitles;