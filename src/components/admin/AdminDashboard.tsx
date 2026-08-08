import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, ComicItem } from "../../services/firebase";
import { verifyDeviceTrust, logoutAdmin, sendAdminMagicLink, verifyAdminMagicLink, registerTrustedDevice } from "../../services/authService";
import { fetchAllComics, createComic, updateComic, deleteComic, bulkUpdateStatus, bulkDeleteComics, batchImportComics } from "../../services/comicService";
import { exportComicsToExcel, downloadExcelTemplate, parseExcelFile } from "../../utils/excelUtils";
import AdminTable from "../../components/admin/AdminTable";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [comics, setComics] = useState<ComicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComic, setEditingComic] = useState<Partial<ComicItem> | null>(null);

  useEffect(() => {
    checkAuthAndTrust();
  }, []);

  async function checkAuthAndTrust() {
    try {
      setLoading(true);

      if (window.location.href.includes("apiKey=")) {
        const user = await verifyAdminMagicLink();
        if (user) {
          await registerTrustedDevice(user.uid);
          setIsAuthenticated(true);
          await loadComics();
          return;
        }
      }

      const currentUser = auth.currentUser;
      if (currentUser) {
        const isTrusted = await verifyDeviceTrust(currentUser.uid);
        if (isTrusted) {
          setIsAuthenticated(true);
          await loadComics();
          return;
        }
      }

      setIsAuthenticated(false);
    } catch (err: unknown) {
      console.error(err);
      setAuthStatus((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function loadComics() {
    const data = await fetchAllComics();
    setComics(data);
  }

  async function handleSendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    try {
      setAuthStatus("Sending Magic Link...");
      await sendAdminMagicLink(emailInput);
      setAuthStatus("Magic link sent! Please check your email to authorize this device.");
    } catch (err: unknown) {
      setAuthStatus("Error sending link: " + (err as Error).message);
    }
  }

  async function handleSaveComic(e: React.FormEvent) {
    e.preventDefault();
    if (!editingComic || !editingComic.title) return;

    if (editingComic.id) {
      await updateComic(editingComic.id, editingComic);
    } else {
      await createComic({
        no: comics.length + 1,
        title: editingComic.title,
        chapter: editingComic.chapter || 0,
        rating: editingComic.rating || 0,
        genre: editingComic.genre || [],
        status: editingComic.status || "Ongoing",
        myOpinion: editingComic.myOpinion || "",
        img: editingComic.img || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    setIsModalOpen(false);
    setEditingComic(null);
    await loadComics();
  }

  async function handleExcelImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const parsedItems = await parseExcelFile(file);
      await batchImportComics(parsedItems);
      await loadComics();
      alert(`Successfully imported ${parsedItems.length} records!`);
    } catch (err: unknown) {
      alert("Failed to import Excel file: " + (err as Error).message);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-backgroundDark text-text-primary dark:text-textDark-primary">
        <p className="text-lg font-semibold animate-pulse">Loading Admin Portal...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-background dark:bg-backgroundDark">
        <Navbar />
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-backgroundDark-secondary shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 my-12">
          <h2 className="text-2xl font-bold mb-2 text-center text-primary">Admin Access Verification</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 text-center">
            2FA Device Trust is required. Please sign in with your email magic link to authorize this device.
          </p>

          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <input
              type="email"
              placeholder="Admin Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className="w-full p-2.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded shadow transition-colors"
            >
              Send Magic Link (2FA)
            </button>
          </form>

          {authStatus && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded border border-blue-200 dark:border-blue-800">
              {authStatus}
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-backgroundDark text-text-primary dark:text-textDark-primary">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Reading List Manager</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage records, run bulk operations, or import/export Excel files.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setEditingComic({});
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow"
            >
              + Add Comic
            </button>

            <button
              onClick={() => exportComicsToExcel(comics)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow"
            >
              Export Excel
            </button>

            <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow cursor-pointer">
              Import Excel/CSV
              <input type="file" accept=".xlsx, .csv" onChange={handleExcelImport} className="hidden" />
            </label>

            <button
              onClick={downloadExcelTemplate}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg shadow"
            >
              Template
            </button>

            <button
              onClick={async () => {
                await logoutAdmin();
                setIsAuthenticated(false);
                navigate("/");
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow"
            >
              Logout
            </button>
          </div>
        </div>

        <AdminTable
          comics={comics}
          onEdit={(item) => {
            setEditingComic(item);
            setIsModalOpen(true);
          }}
          onDelete={async (id) => {
            await deleteComic(id);
            await loadComics();
          }}
          onBulkDelete={async (ids) => {
            await bulkDeleteComics(ids);
            await loadComics();
          }}
          onBulkStatusUpdate={async (ids, status) => {
            await bulkUpdateStatus(ids, status);
            await loadComics();
          }}
        />
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-backgroundDark-secondary p-6 rounded-xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">{editingComic?.id ? "Edit Comic" : "Add New Comic"}</h2>

            <form onSubmit={handleSaveComic} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  required
                  value={editingComic?.title || ""}
                  onChange={(e) => setEditingComic((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Chapter</label>
                  <input
                    type="number"
                    value={editingComic?.chapter || 0}
                    onChange={(e) => setEditingComic((prev) => ({ ...prev, chapter: Number(e.target.value) }))}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Rating (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editingComic?.rating || 0}
                    onChange={(e) => setEditingComic((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Genre (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editingComic?.genre) ? editingComic.genre.join(", ") : ""}
                  onChange={(e) =>
                    setEditingComic((prev) => ({
                      ...prev,
                      genre: e.target.value.split(",").map((s) => s.trim()),
                    }))
                  }
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Status</label>
                <input
                  type="text"
                  value={editingComic?.status || "Ongoing"}
                  onChange={(e) => setEditingComic((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Cover Image URL</label>
                <input
                  type="url"
                  value={editingComic?.img || ""}
                  onChange={(e) => setEditingComic((prev) => ({ ...prev, img: e.target.value }))}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">My Personal Opinion</label>
                <textarea
                  rows={3}
                  value={editingComic?.myOpinion || ""}
                  onChange={(e) => setEditingComic((prev) => ({ ...prev, myOpinion: e.target.value }))}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded font-semibold shadow">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;