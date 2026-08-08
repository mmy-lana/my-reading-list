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


function formatDate(dateStr?: string): string {
  if (!dateStr || !dateStr.trim()) return "[No data]";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr;
  }
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
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="group relative w-full max-w-3xl rounded-3xl p-[2px] transition-all duration-300 animate-modal-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-70 blur-md group-hover:opacity-100 transition duration-500 animate-pulse" />

        <div className={`relative w-full p-6 sm:p-8 rounded-3xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto border shadow-2xl ${
          isDark ? "bg-slate-900/95 text-gray-100 border-slate-800" : "bg-white/95 text-gray-900 border-gray-200"
        }`}>
          <button
            className={`absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full transition-all z-20 shadow-md ${
              isDark ? "bg-slate-800 text-gray-200 hover:bg-slate-700 hover:scale-110" : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-110"
            }`}
            onClick={onClose}
          >
            &times;
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            <div className={`w-full md:w-64 shrink-0 aspect-[2/3] overflow-hidden rounded-2xl shadow-2xl border relative group/img ${
              isDark ? "bg-slate-800 border-slate-700" : "bg-gray-100 border-gray-200"
            }`}>
              <img
                src={currentImgSrc}
                alt={comic.title}
                onError={handleImageError}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
              />
            </div>

            <div className="flex flex-col justify-between flex-1 space-y-4 text-left w-full">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-3 py-1 text-xs uppercase tracking-wider rounded-full shadow-md font-bold ${getStatusBadgeStyle(comic.status)}`}>
                    {comic.status || "Ongoing"}
                  </span>
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border shadow-sm ${
                    isDark ? "bg-slate-800 text-purple-300 border-purple-500/30" : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}>
                    {comic.type || <span className="italic">[No data]</span>}
                  </span>
                </div>
                <h2 className={`text-2xl sm:text-3xl font-black leading-tight tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                  {capitalizeTitle(comic.title)}
                </h2>
              </div>

              <div className={`grid grid-cols-2 gap-2.5 text-xs sm:text-sm p-4 rounded-2xl border backdrop-blur-md ${
                isDark ? "bg-slate-800/60 text-gray-300 border-slate-700/60" : "bg-slate-50 text-gray-700 border-gray-200"
              }`}>
                <p><span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Author:</span> {comic.author || <span className="italic text-gray-400">[No data]</span>}</p>
                <p><span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Studio:</span> {comic.studio || <span className="italic text-gray-400">[No data]</span>}</p>
                <p><span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Chapter:</span> {comic.chapter}</p>
                <p><span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Release Date:</span> {formatDate(comic.releaseDate)}</p>
                <p><span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Created At:</span> {formatDate(comic.createdAt)}</p>
                <p><span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Updated At:</span> {formatDate(comic.updatedAt)}</p>
                <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-slate-700/40">
                  <span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Rating:</span>
                  {comic.rating > 0 ? <StarRating score={comic.rating} /> : <span className="font-bold text-amber-500">?</span>}
                </div>
              </div>

              <div>
                <h4 className={`font-bold text-xs uppercase tracking-wider mb-1.5 ${isDark ? "text-gray-200" : "text-gray-900"}`}>Genre:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(comic.genre) && comic.genre.length > 0 ? (
                    comic.genre.map((g) => (
                      <span key={g} className={`px-2.5 py-1 text-xs rounded-lg font-medium border ${
                        isDark ? "bg-slate-800 text-gray-200 border-slate-700" : "bg-gray-100 text-gray-800 border-gray-300"
                      }`}>
                        {g}
                      </span>
                    ))
                  ) : (
                    <span className="italic text-gray-400 text-xs">[No data]</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className={`font-bold text-xs uppercase tracking-wider mb-1.5 ${isDark ? "text-gray-200" : "text-gray-900"}`}>Synopsis:</h4>
                <p className={`text-xs sm:text-sm leading-relaxed p-3.5 rounded-2xl border max-h-36 overflow-y-auto ${
                  isDark ? "bg-slate-800/40 text-gray-300 border-slate-700/60" : "bg-gray-50 text-gray-600 border-gray-200"
                }`}>
                  {comic.synopsis && comic.synopsis.trim() ? comic.synopsis : <span className="italic text-gray-400">[No data]</span>}
                </p>
              </div>

              <div>
                <h4 className={`font-bold text-xs uppercase tracking-wider mb-1.5 ${isDark ? "text-gray-200" : "text-gray-900"}`}>My Personal Opinion:</h4>
                <p className={`text-xs sm:text-sm leading-relaxed p-3.5 rounded-2xl border ${
                  isDark ? "bg-slate-800/40 text-gray-300 border-slate-700/60" : "bg-gray-50 text-gray-600 border-gray-200"
                }`}>
                  {comic.myOpinion && comic.myOpinion.trim() ? comic.myOpinion : <span className="italic text-gray-400">[No data]</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;