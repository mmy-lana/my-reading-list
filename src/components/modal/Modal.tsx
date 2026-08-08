import React, { useEffect, useState } from "react";
import StarRating from "../shared/StarRating";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  img: string;
  title: string;
  chapter: number;
  score: number;
  status: string;
}

function getFallbackCoverSvg(title: string): string {
  const safeTitle = (title || "Manga").substring(0, 24);
  const encodedTitle = encodeURIComponent(safeTitle);
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="50%" stop-color="%234338ca"/><stop offset="100%" stop-color="%23d946ef"/></linearGradient></defs><rect width="300" height="450" fill="url(%23g)"/><circle cx="150" cy="180" r="70" fill="%23ffffff" opacity="0.1"/><text x="150" y="230" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23ffffff" text-anchor="middle">${encodedTitle}</text><text x="150" y="260" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23f472b6" text-anchor="middle">M1YUKI READ</text></svg>`;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  img,
  title,
  chapter,
  score,
  status,
}) => {
  const fallbackSvg = getFallbackCoverSvg(title);
  const [imgSrc, setImgSrc] = useState(img && img.trim() !== "" ? img : fallbackSvg);

  useEffect(() => {
    setImgSrc(img && img.trim() !== "" ? img : fallbackSvg);
  }, [img, title, fallbackSvg]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-11/12 max-w-xl p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="w-40 aspect-[2/3] shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-md">
            <img
              src={imgSrc}
              alt={title}
              onError={() => setImgSrc(fallbackSvg)}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-between flex-1 space-y-4 text-left w-full">
            <div>
              <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light mb-2">
                {status}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{title}</h2>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p><span className="font-semibold text-gray-900 dark:text-white">Chapter:</span> {chapter}</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white">Rating:</span>
                <StarRating score={score} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;