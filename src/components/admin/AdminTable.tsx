import React, { useState } from "react";
import { ComicItem } from "../../services/firebase";
import StarRating from "../shared/StarRating";
import { capitalizeTitle, getStatusBadgeStyle } from "../../utils/textUtils";
import { useTheme } from "../../utils/ThemeProvider";

interface AdminTableProps {
  comics: ComicItem[];
  onEdit: (item: ComicItem) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkStatusUpdate: (ids: string[], status: string) => void;
}

type SortField = "no" | "title" | "chapter" | "rating" | "status" | "author" | "studio" | "type" | "releaseDate";

const AdminTable: React.FC<AdminTableProps> = ({
  comics,
  onEdit,
  onDelete,
  onBulkDelete,
  onBulkStatusUpdate,
}) => {
  const { isDark } = useTheme();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState("Completed");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedComics = [...comics].sort((a, b) => {
    let valA = (a[sortField] ?? "") as string | number;
    let valB = (b[sortField] ?? "") as string | number;

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(comics.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = comics.length > 0 && selectedIds.length === comics.length;

  return (
    <div className="w-full">
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-4 bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-xl">
          <span className="font-semibold text-sm">
            {selectedIds.length} item(s) selected
          </span>
          <div className="flex items-center gap-3">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            >
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="END">END</option>
              <option value="Hiatus">Hiatus</option>
            </select>
            <button
              onClick={() => onBulkStatusUpdate(selectedIds, bulkStatus)}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
            >
              Update Status
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete ${selectedIds.length} items?`)) {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded shadow"
            >
              Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* Horizontally Scrollable Table with Freeze/Sticky Actions Column */}
      <div className={`relative overflow-x-auto rounded-xl shadow border max-h-[70vh] ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
      }`}>
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead className={`sticky top-0 z-20 border-b select-none ${
            isDark ? "bg-slate-800 text-gray-200 border-slate-700" : "bg-gray-100 text-gray-800 border-gray-200"
          }`}>
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="p-3 font-bold">#</th>
              <th onClick={() => handleSort("title")} className="p-3 cursor-pointer hover:text-primary font-bold">
                Title {sortField === "title" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("chapter")} className="p-3 cursor-pointer hover:text-primary font-bold">
                Ch {sortField === "chapter" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("rating")} className="p-3 cursor-pointer hover:text-primary font-bold">
                Rating {sortField === "rating" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("status")} className="p-3 cursor-pointer hover:text-primary font-bold">
                Status {sortField === "status" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("author")} className="p-3 cursor-pointer hover:text-primary font-bold">
                Author {sortField === "author" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("studio")} className="p-3 cursor-pointer hover:text-primary font-bold">
                Studio {sortField === "studio" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("type")} className="p-3 cursor-pointer hover:text-primary font-bold">
                Type {sortField === "type" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("releaseDate")} className="p-3 cursor-pointer hover:text-primary font-bold">
                Release Date {sortField === "releaseDate" && (sortAsc ? "▲" : "▼")}
              </th>
              <th className="p-3 font-bold">Description / Opinion</th>
              {/* Sticky Frozen Actions Column Header */}
              <th className={`p-3 font-bold sticky right-0 shadow-l z-30 ${
                isDark ? "bg-slate-800 text-gray-200" : "bg-gray-100 text-gray-800"
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedComics.map((item, idx) => (
              <tr
                key={item.id}
                className={`border-b transition-colors ${
                  isDark ? "hover:bg-slate-800/60 border-slate-800" : "hover:bg-gray-50 border-gray-200"
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelectOne(item.id)}
                    className="rounded"
                  />
                </td>
                <td className={`p-3 font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>#{idx + 1}</td>
              <td className={`p-3 font-bold max-w-xs truncate ${isDark ? "text-gray-100" : "text-gray-900"}`}>{capitalizeTitle(item.title)}</td>
              <td className={`p-3 font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>{item.chapter}</td>
              <td className="p-3">
                {item.rating > 0 ? <StarRating score={item.rating} /> : <span className="font-bold text-amber-500">?</span>}
              </td>
              <td className="p-3">
                <span className={`px-2 py-0.5 text-[10px] uppercase rounded-full ${getStatusBadgeStyle(item.status)}`}>
                  {item.status || "TBD"}
                </span>
              </td>
              <td className={`p-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{item.author || <span className="italic text-gray-400">[No data]</span>}</td>
              <td className={`p-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{item.studio || <span className="italic text-gray-400">[No data]</span>}</td>
              <td className={`p-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{item.type || "Manga"}</td>
              <td className={`p-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{item.releaseDate || <span className="italic text-gray-400">[No data]</span>}</td>
              <td className={`p-3 max-w-xs truncate ${isDark ? "text-gray-400" : "text-gray-700"}`}>
                {item.myOpinion || <span className="italic text-gray-400">[No data]</span>}
              </td>
                {/* Sticky Frozen Actions Cell */}
                <td className={`p-3 sticky right-0 border-l shadow-l z-20 ${
                  isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
                }`}>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onEdit(item)}
                      className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded font-medium shadow"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${item.title}"?`)) {
                          onDelete(item.id);
                        }
                      }}
                      className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded font-medium shadow"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;