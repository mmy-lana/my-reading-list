import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ComicItem } from "../../services/firebase";
import { useTheme } from "../../utils/ThemeProvider";

interface ComicFormModalProps {
  isOpen: boolean;
  editingComic: Partial<ComicItem> | null;
  setEditingComic: React.Dispatch<React.SetStateAction<Partial<ComicItem> | null>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ComicFormModal: React.FC<ComicFormModalProps> = ({
  isOpen,
  editingComic,
  setEditingComic,
  onClose,
  onSubmit,
}) => {
  const { isDark } = useTheme();
  const [initialComic, setInitialComic] = useState<Partial<ComicItem> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setInitialComic(editingComic ? JSON.parse(JSON.stringify(editingComic)) : {});
    }
  }, [isOpen]);

  const isDirty = useMemo(() => {
    if (!isOpen || !initialComic) return false;
    return JSON.stringify(editingComic) !== JSON.stringify(initialComic);
  }, [isOpen, editingComic, initialComic]);

  const handleAttemptClose = useCallback(() => {
    if (isDirty) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close and discard your edits?"
      );
      if (!confirmClose) return;
    }
    onClose();
  }, [isDirty, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleAttemptClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleAttemptClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={handleAttemptClose}
    >
      <div
        className={`p-6 rounded-2xl shadow-2xl max-w-2xl w-full border animate-modal-in ${
          isDark ? "bg-slate-900 text-gray-100 border-slate-800" : "bg-white text-gray-900 border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
            {editingComic?.id ? "Edit Comic" : "Add New Comic"}
          </h2>
          <button
            type="button"
            onClick={handleAttemptClose}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              isDark ? "bg-slate-800 text-gray-200 hover:bg-slate-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 text-sm max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className={`block mb-1 font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>Title *</label>
            <input
              type="text"
              required
              value={editingComic?.title || ""}
              onChange={(e) => setEditingComic((prev) => ({ ...prev, title: e.target.value }))}
              className={`w-full p-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                isDark ? "border-slate-700 bg-slate-800 text-gray-100" : "border-gray-300 bg-gray-50 text-gray-900"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Chapter *</label>
              <input
                type="number"
                required
                value={editingComic?.chapter || 0}
                onChange={(e) => setEditingComic((prev) => ({ ...prev, chapter: Number(e.target.value) }))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Rating (0 - 10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={editingComic?.rating || 0}
                onChange={(e) => setEditingComic((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Author</label>
              <input
                type="text"
                placeholder="Author"
                value={editingComic?.author || ""}
                onChange={(e) => setEditingComic((prev) => ({ ...prev, author: e.target.value }))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Studio</label>
              <input
                type="text"
                placeholder="Studio / Publisher"
                value={editingComic?.studio || ""}
                onChange={(e) => setEditingComic((prev) => ({ ...prev, studio: e.target.value }))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Type</label>
              <select
                value={editingComic?.type || "Manga"}
                onChange={(e) => setEditingComic((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Manga">Manga</option>
                <option value="Manhwa">Manhwa</option>
                <option value="Manhua">Manhua</option>
                <option value="Novel">Novel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Status</label>
              <input
                type="text"
                placeholder="Ongoing / END / S1 END"
                value={editingComic?.status || "Ongoing"}
                onChange={(e) => setEditingComic((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Release Date</label>
              <input
                type="date"
                value={editingComic?.releaseDate || ""}
                onChange={(e) => setEditingComic((prev) => ({ ...prev, releaseDate: e.target.value }))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Created At</label>
              <input
                type="text"
                placeholder="ISO Date"
                value={editingComic?.createdAt || ""}
                onChange={(e) => setEditingComic((prev) => ({ ...prev, createdAt: e.target.value }))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Updated At</label>
              <input
                type="text"
                placeholder="ISO Date"
                value={editingComic?.updatedAt || ""}
                onChange={(e) => setEditingComic((prev) => ({ ...prev, updatedAt: e.target.value }))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Primary Cover Image URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={editingComic?.img || ""}
              onChange={(e) => setEditingComic((prev) => ({ ...prev, img: e.target.value }))}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-slate-900 dark:text-slate-100">3 Image Fallback URLs (Optional)</label>
            <input
              type="url"
              placeholder="Fallback 1 (https://...)"
              value={editingComic?.imgFallback1 || ""}
              onChange={(e) => setEditingComic((prev) => ({ ...prev, imgFallback1: e.target.value }))}
              className="w-full p-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
            <input
              type="url"
              placeholder="Fallback 2 (https://...)"
              value={editingComic?.imgFallback2 || ""}
              onChange={(e) => setEditingComic((prev) => ({ ...prev, imgFallback2: e.target.value }))}
              className="w-full p-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
            <input
              type="url"
              placeholder="Fallback 3 (https://...)"
              value={editingComic?.imgFallback3 || ""}
              onChange={(e) => setEditingComic((prev) => ({ ...prev, imgFallback3: e.target.value }))}
              className="w-full p-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Genre (comma separated)</label>
            <input
              type="text"
              placeholder="Action, Fantasy, Martial Arts"
              value={Array.isArray(editingComic?.genre) ? editingComic.genre.join(", ") : ""}
              onChange={(e) =>
                setEditingComic((prev) => ({
                  ...prev,
                  genre: e.target.value.split(",").map((s) => s.trim()),
                }))
              }
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Synopsis</label>
            <textarea
              rows={2}
              placeholder="Official storyline summary..."
              value={editingComic?.synopsis || ""}
              onChange={(e) => setEditingComic((prev) => ({ ...prev, synopsis: e.target.value }))}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-1 font-bold text-slate-900 dark:text-slate-100">Description / My Opinion</label>
            <textarea
              rows={2}
              placeholder="Personal opinion..."
              value={editingComic?.myOpinion || ""}
              onChange={(e) => setEditingComic((prev) => ({ ...prev, myOpinion: e.target.value }))}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleAttemptClose}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold shadow-lg transition-colors">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComicFormModal;