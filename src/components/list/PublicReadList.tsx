import React, { useState, useMemo } from "react";
import { ComicItem } from "../../services/firebase";
import { useLanguage } from "../../utils/i18n";
import { exportComicsToExcel } from "../../utils/excelUtils";
import Card from "../card/Card/Card";
import StarRating from "../shared/StarRating";
import Modal from "../modal/Modal";
import { useTheme } from "../../utils/ThemeProvider";

interface PublicReadListProps {
  comics: ComicItem[];
}


const PublicReadList: React.FC<PublicReadListProps> = ({ comics }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedCard, setSelectedCard] = useState<ComicItem | null>(null);

  const allGenres = useMemo(() => {
    const genresSet = new Set<string>();
    comics.forEach((c) => {
      if (Array.isArray(c.genre)) {
        c.genre.forEach((g) => genresSet.add(g.trim()));
      }
    });
    return Array.from(genresSet).filter(Boolean).sort();
  }, [comics]);

  const filteredComics = useMemo(() => {
    return comics.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.myOpinion && item.myOpinion.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesGenre =
        selectedGenre === "All" ||
        (Array.isArray(item.genre) && item.genre.includes(selectedGenre));

      const matchesStatus =
        selectedStatus === "All" ||
        item.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [comics, searchTerm, selectedGenre, selectedStatus]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className={`flex flex-col md:flex-row items-center justify-between gap-4 mb-8 p-4 rounded-xl shadow-md border transition-colors duration-300 ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
      }`}>
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder={t.searchPlaceholder || "Search titles..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              isDark
                ? "border-slate-700 bg-slate-800 text-gray-100 placeholder-gray-400"
                : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              isDark
                ? "border-slate-700 bg-slate-800 text-gray-100"
                : "border-gray-300 bg-gray-50 text-gray-900"
            }`}
          >
            <option value="All">{t.allGenres || "All Genres"}</option>
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              isDark
                ? "border-slate-700 bg-slate-800 text-gray-100"
                : "border-gray-300 bg-gray-50 text-gray-900"
            }`}
          >
            <option value="All">All Statuses</option>
            <option value="END">END</option>
            <option value="Ongoing">Ongoing</option>
            <option value="S1 END">S1 END</option>
            <option value="S2 Start">S2 Start</option>
          </select>

          <div className={`flex items-center p-1 rounded-lg ${
            isDark ? "bg-slate-800" : "bg-gray-200"
          }`}>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-white shadow-sm"
                  : isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === "table"
                  ? "bg-primary text-white shadow-sm"
                  : isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"
              }`}
            >
              Table
            </button>
          </div>

          <button
            onClick={() => exportComicsToExcel(filteredComics)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow transition-colors duration-200 flex items-center gap-1.5"
          >
            Download List (.xlsx)
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 justify-items-center">
          {filteredComics.map((item, index) => (
            <Card
              key={item.id}
              index={index}
              img={item.img}
              title={item.title}
              chapter={item.chapter}
              score={item.rating}
              status={item.status}
              onClick={() => setSelectedCard(item)}
            />
          ))}
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-xl shadow-lg border ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
        }`}>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className={`border-b ${
                isDark ? "bg-slate-800 text-gray-200 border-slate-700" : "bg-gray-100 text-gray-800 border-gray-200"
              }`}>
                <th className="p-3">#</th>
                <th className="p-3">Title</th>
                <th className="p-3">Ch</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Author / Studio</th>
                <th className="p-3">Genre</th>
                <th className="p-3">Status</th>
                <th className="p-3">Description / Opinion</th>
              </tr>
            </thead>
            <tbody>
              {filteredComics.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedCard(item)}
                  className={`cursor-pointer border-b transition-colors ${
                    isDark ? "hover:bg-slate-800/60 border-slate-800" : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <td className={`p-3 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>#{idx + 1}</td>
                  <td className={`p-3 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{item.title}</td>
                  <td className={`p-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>{item.chapter}</td>
                  <td className="p-3">
                    {item.rating > 0 ? <StarRating score={item.rating} /> : <span className="font-bold text-amber-500">?</span>}
                  </td>
                  <td className={`p-3 text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {item.author || item.studio ? `${item.author || ""}${item.author && item.studio ? " / " : ""}${item.studio || ""}` : <span className="italic text-gray-400">[No data]</span>}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(item.genre) && item.genre.length > 0
                        ? item.genre.map((g) => (
                            <span
                              key={g}
                              className={`px-2 py-0.5 text-xs rounded border ${
                                isDark ? "bg-slate-800 text-gray-200 border-slate-700" : "bg-gray-200 text-gray-800 border-gray-300"
                              }`}
                            >
                              {g}
                            </span>
                          ))
                        : <span className="italic text-gray-400 text-xs">[No data]</span>}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-primary">{item.status || "To Be Determined"}</td>
                  <td className={`p-3 text-xs max-w-xs truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {item.myOpinion || <span className="italic text-gray-400">[No data]</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCard && (
        <Modal
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          comic={selectedCard}
        />
      )}
    </div>
  );
};

export default PublicReadList;