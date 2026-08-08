import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import PublicReadList from "../../components/list/PublicReadList";
import Footer from "../../components/footer/Footer";
import { fetchAllComics } from "../../services/comicService";
import { ComicItem } from "../../services/firebase";
import { useLanguage } from "../../utils/i18n";

const AllComics: React.FC = () => {
  const [comics, setComics] = useState<ComicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllComics();
        setComics(data);
      } catch (err) {
        console.error("Failed to load comics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary dark:bg-backgroundDark dark:text-textDark-primary transition-colors duration-300 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-primary mb-2">
              {(t as Record<string, string>).allList || "All Reading List"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Browse, search, and filter the complete collection of {comics.length} titles.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500 font-semibold animate-pulse">
              Loading All Comics...
            </div>
          ) : (
            <PublicReadList comics={comics} />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AllComics;