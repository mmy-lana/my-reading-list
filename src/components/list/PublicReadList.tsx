import React, { useState, useMemo } from "react";
import { ComicItem } from "../../services/firebase";
import { useLanguage } from "../../utils/i18n";
import { exportComicsToExcel } from "../../utils/excelUtils";
import Card from "../card/Card/Card";
import StarRating from "../shared/StarRating";
import Modal from "../modal/Modal";

interface PublicReadListProps {
  comics: ComicItem[];
}

const PublicReadList: React.FC<PublicReadListProps> = ({ comics }) => {
  const { t } = useLanguage();
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-backgroundDark-secondary p-4 rounded-xl shadow-md transition-colors duration-300">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder={t.searchPlaceholder || "Search titles..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Statuses</option>
            <option value="END">END</option>
            <option value="Ongoing">Ongoing</option>
            <option value="S1 END">S1 END</option>
            <option value="S2 Start">S2 Start</option>
          </select>

          <div className="flex items-center bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === "table"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
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
        <div className="overflow-x-auto bg-white dark:bg-backgroundDark-secondary rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                <th className="p-3">No</th>
                <th className="p-3">Title</th>
                <th className="p-3">Ch</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Genre</th>
                <th className="p-3">Status</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredComics.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedCard(item)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition-colors"
                >
                  <td className="p-3 font-medium text-gray-500 dark:text-gray-400">{item.no || idx + 1}</td>
                  <td className="p-3 font-semibold text-gray-900 dark:text-white">{item.title}</td>
                  <td className="p-3">{item.chapter}</td>
                  <td className="p-3">
                    <StarRating score={item.rating} />
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(item.genre)
                        ? item.genre.map((g) => (
                            <span
                              key={g}
                              className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
                            >
                              {g}
                            </span>
                          ))
                        : item.genre}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-primary dark:text-primary-light">{item.status}</td>
                  <td className="p-3 text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">{item.myOpinion}</td>
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
          img={selectedCard.img || "https://via.placeholder.com/150"}
          title={selectedCard.title}
          chapter={selectedCard.chapter}
          score={selectedCard.rating}
          status={selectedCard.status}
        />
      )}
    </div>
  );
};

export default PublicReadList;