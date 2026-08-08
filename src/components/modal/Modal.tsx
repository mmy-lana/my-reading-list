import React, { useEffect, useState } from "react";
import StarRating from "../shared/StarRating";
import { ComicItem } from "../../services/firebase";
import { getImageSources } from "../../utils/imageFallback";
import { capitalizeTitle, getStatusBadgeStyle } from "../../utils/textUtils";
import { useTheme } from "../../utils/ThemeProvider";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  comic: ComicItem | null;
}


const Modal: React.FC<ModalProps> = ({ isOpen, onClose, comic }) => {
  const { isDark } = useTheme();
  const [sourceIndex, setImgSourceIndex] = useState(0);

  useEffect(() => {
    setImgSourceIndex(0);
  }, [comic]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !comic) return null;

  const sources = getImageSources({
    img: comic.img,
    imgFallback1: comic.imgFallback1,
    imgFallback2: comic.imgFallback2,
    imgFallback3: comic.imgFallback3,
    title: comic.title,
  });

  const currentImgSrc = sources[sourceIndex] || sources[sources.length - 1];

  const handleImageError = () => {
    if (sourceIndex < sources.length - 1) {
      setImgSourceIndex((prev) => prev + 1);
    }
  };


  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl p-6 rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto animate-modal-in ${
          isDark ? "bg-slate-900 text-gray-100 border-slate-800" : "bg-white text-gray-900 border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-10 ${
            isDark ? "bg-slate-800 text-gray-200 hover:bg-slate-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className={`w-44 aspect-[2/3] shrink-0 overflow-hidden rounded-xl shadow-lg border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-gray-100 border-gray-200"
          }`}>
            <img
              src={currentImgSrc}
              alt={comic.title}
              onError={handleImageError}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between flex-1 space-y-3 text-left w-full">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-3 py-1 text-xs uppercase tracking-wider rounded-full shadow-sm ${getStatusBadgeStyle(comic.status)}`}>
                  {comic.status || "To Be Determined"}
                </span>
                {comic.type && (
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full border ${
                    isDark ? "bg-slate-800 text-gray-200 border-slate-700" : "bg-gray-200 text-gray-700 border-gray-300"
                  }`}>
                    {comic.type}
                  </span>
                )}
              </div>
              <h2 className={`text-2xl font-black leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                {capitalizeTitle(comic.title)}
              </h2>
            </div>

            <div className={`grid grid-cols-2 gap-2 text-xs sm:text-sm p-3 rounded-xl border ${
              isDark ? "bg-slate-800/50 text-gray-300 border-slate-800" : "bg-gray-50 text-gray-700 border-gray-200"
            }`}>
              <p><span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Author:</span> {comic.author || <span className="italic text-gray-400">[No data]</span>}</p>
              <p><span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Studio:</span> {comic.studio || <span className="italic text-gray-400">[No data]</span>}</p>
              <p><span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Chapter:</span> {comic.chapter}</p>
              <p><span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Release Date:</span> {comic.releaseDate || <span className="italic text-gray-400">[No data]</span>}</p>
              <div className="flex items-center gap-1.5 col-span-2">
                <span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Rating:</span>
                {comic.rating > 0 ? <StarRating score={comic.rating} /> : <span className="font-bold text-amber-500">?</span>}
              </div>
            </div>

            {comic.synopsis && (
              <div>
                <h4 className={`font-bold text-xs uppercase tracking-wider mb-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>Synopsis:</h4>
                <p className={`text-xs sm:text-sm leading-relaxed p-3 rounded-xl border max-h-32 overflow-y-auto ${
                  isDark ? "bg-slate-800/50 text-gray-300 border-slate-800" : "bg-gray-50 text-gray-600 border-gray-200"
                }`}>
                  {comic.synopsis}
                </p>
              </div>
            )}

            <div>
              <h4 className={`font-bold text-xs uppercase tracking-wider mb-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>My Personal Opinion:</h4>
              <p className={`text-xs sm:text-sm leading-relaxed p-3 rounded-xl border ${
                isDark ? "bg-slate-800/50 text-gray-300 border-slate-800" : "bg-gray-50 text-gray-600 border-gray-200"
              }`}>
                {comic.myOpinion && comic.myOpinion.trim() ? comic.myOpinion : <span className="italic text-gray-400">[No data]</span>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;