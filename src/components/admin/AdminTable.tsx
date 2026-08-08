import React, { useState } from "react";
import { ComicItem } from "../../services/firebase";
import StarRating from "../shared/StarRating";

interface AdminTableProps {
  comics: ComicItem[];
  onEdit: (item: ComicItem) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkStatusUpdate: (ids: string[], status: string) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({
  comics,
  onEdit,
  onDelete,
  onBulkDelete,
  onBulkStatusUpdate,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState("Completed");

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
              className="px-3 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
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

      <div className="overflow-x-auto bg-white dark:bg-backgroundDark-secondary rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="p-3">No</th>
              <th className="p-3">Title</th>
              <th className="p-3">Ch</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comics.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-800"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelectOne(item.id)}
                    className="rounded"
                  />
                </td>
                <td className="p-3 text-gray-500 dark:text-gray-400">{item.no}</td>
                <td className="p-3 font-semibold">{item.title}</td>
                <td className="p-3">{item.chapter}</td>
                <td className="p-3">
                  <StarRating score={item.rating} />
                </td>
                <td className="p-3">{item.status}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="px-2.5 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${item.title}"?`)) {
                          onDelete(item.id);
                        }
                      }}
                      className="px-2.5 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded font-medium"
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