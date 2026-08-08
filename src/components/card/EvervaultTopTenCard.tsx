import React, { useState, useEffect, MouseEvent } from "react";
import { ComicItem } from "../../services/firebase";
import StarRating from "../shared/StarRating";

interface EvervaultTopTenCardProps {
  item: ComicItem;
  index: number;
  onClick: () => void;
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

function generateRandomString(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return result;
}

function getFallbackCoverSvg(title: string): string {
  const safeTitle = (title || "Manga").substring(0, 24);
  const encodedTitle = encodeURIComponent(safeTitle);
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="50%" stop-color="%234338ca"/><stop offset="100%" stop-color="%23d946ef"/></linearGradient></defs><rect width="300" height="450" fill="url(%23g)"/><circle cx="150" cy="180" r="70" fill="%23ffffff" opacity="0.1"/><text x="150" y="230" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23ffffff" text-anchor="middle">${encodedTitle}</text><text x="150" y="260" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23f472b6" text-anchor="middle">M1YUKI READ</text></svg>`;
}

export const EvervaultTopTenCard: React.FC<EvervaultTopTenCardProps> = ({
  item,
  index,
  onClick,
}) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [randomString, setRandomString] = useState("");
  const fallbackSvg = getFallbackCoverSvg(item.title);
  const [imgSrc, setImgSrc] = useState(item.img && item.img.trim() !== "" ? item.img : fallbackSvg);

  useEffect(() => {
    setRandomString(generateRandomString(1500));
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    setMouseX(e.clientX - left);
    setMouseY(e.clientY - top);
    setRandomString(generateRandomString(1500));
  };

  const getRankBadge = (idx: number) => {
    if (idx === 0) return "bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 text-black font-extrabold shadow-amber-500/50";
    if (idx === 1) return "bg-gradient-to-r from-gray-200 via-gray-400 to-slate-500 text-black font-extrabold shadow-gray-400/50";
    if (idx === 2) return "bg-gradient-to-r from-amber-600 via-orange-700 to-amber-900 text-white font-extrabold shadow-amber-800/50";
    return "bg-gray-800/90 text-gray-200 font-bold border border-gray-700";
  };

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className="group relative w-full max-w-[210px] aspect-[2/3.4] rounded-2xl bg-black/90 p-1 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden border border-white/10 hover:border-primary/50 shadow-xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 z-10 opacity-30 mix-blend-overlay text-[8px] font-mono text-primary leading-none select-none break-all p-1"
          style={{
            maskImage: `radial-gradient(180px circle at ${mouseX}px ${mouseY}px, white, transparent)`,
            WebkitMaskImage: `radial-gradient(180px circle at ${mouseX}px ${mouseY}px, white, transparent)`,
          }}
        >
          {randomString}
        </div>
      </div>

      <div className="relative z-20 h-full w-full rounded-xl bg-gray-950/90 dark:bg-gray-900/90 p-2.5 flex flex-col justify-between backdrop-blur-md">
        <div className="relative w-full aspect-[2/2.7] overflow-hidden rounded-lg bg-gray-800">
          <img
            src={imgSrc}
            alt={item.title}
            onError={() => setImgSrc(fallbackSvg)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-md bg-black/70 text-white backdrop-blur-md border border-white/10">
            {item.status}
          </span>

          <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs rounded-md shadow-lg ${getRankBadge(index)}`}>
            #{index + 1}
          </span>
        </div>

        <div className="mt-2 flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-bold text-xs text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">
              Chapter {item.chapter}
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <StarRating score={item.rating} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvervaultTopTenCard;