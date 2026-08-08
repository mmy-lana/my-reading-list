import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, ComicItem } from "../../services/firebase";
import { verifyDeviceTrust, logoutAdmin, sendAdminMagicLink, verifyAdminMagicLink, registerTrustedDevice } from "../../services/authService";
import { fetchAllComics, createComic, updateComic, deleteComic, bulkUpdateStatus, bulkDeleteComics, batchImportComics } from "../../services/comicService";
import { exportComicsToExcel, downloadExcelTemplate, parseExcelFile } from "../../utils/excelUtils";
import AdminTable from "../../components/admin/AdminTable";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import ComicFormModal from "./ComicFormModal";
import { useTheme } from "../../utils/ThemeProvider";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
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
        synopsis: editingComic.synopsis || "",
        img: editingComic.img || "",
        imgFallback1: editingComic.imgFallback1 || "",
        imgFallback2: editingComic.imgFallback2 || "",
        imgFallback3: editingComic.imgFallback3 || "",
        author: editingComic.author || "",
        studio: editingComic.studio || "",
        type: editingComic.type || "Manga",
        releaseDate: editingComic.releaseDate || "",
        createdAt: editingComic.createdAt || new Date().toISOString(),
        updatedAt: editingComic.updatedAt || new Date().toISOString(),
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
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-slate-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}>
        <p className="text-lg font-semibold animate-pulse">Loading Admin Portal...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${
        isDark ? "bg-slate-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}>
        <Navbar />
        <div className={`max-w-md mx-auto p-6 shadow-xl rounded-xl border my-12 ${
          isDark ? "bg-slate-900 text-gray-100 border-slate-800" : "bg-white text-gray-900 border-gray-200"
        }`}>
          <h2 className="text-2xl font-bold mb-2 text-center text-primary">Admin Access Verification</h2>
          <p className={`text-xs mb-6 text-center ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            2FA Device Trust is required. Please sign in with your email magic link to authorize this device.
          </p>

          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <input
              type="email"
              placeholder="Admin Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                isDark ? "border-slate-700 bg-slate-800 text-gray-100" : "border-gray-300 bg-gray-50 text-gray-900"
              }`}
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow transition-colors"
            >
              Send Magic Link (2FA)
            </button>
          </form>

          {authStatus && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-lg border border-blue-200 dark:border-blue-800">
              {authStatus}
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-gray-100" : "bg-gray-50 text-gray-900"
    }`}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-primary">Admin Reading List Manager</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
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

      <ComicFormModal
        isOpen={isModalOpen}
        editingComic={editingComic}
        setEditingComic={setEditingComic}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveComic}
      />

      <Footer />
    </div>
  );
};

export default AdminDashboard;