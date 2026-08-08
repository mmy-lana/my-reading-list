import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Hero from "../../components/hero/Hero";
import CardCollection from "../../components/card/CardCollection/CardCollection";
import Footer from "../../components/footer/Footer";
import { fetchAllComics } from "../../services/comicService";
import { ComicItem } from "../../services/firebase";
import { Link } from "react-router-dom";
import { useLanguage } from "../../utils/i18n";

const Home: React.FC = () => {
  const [comics, setComics] = useState<ComicItem[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllComics();
        setComics(data);
      } catch (err) {
        console.error("Failed to load comics:", err);
      }
    }
    loadData();
  }, []);

  const topTenData = [...comics]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  const lastReadData = [...comics]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  const newTitlesData = [...comics]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="relative min-h-screen bg-background text-text-primary dark:bg-backgroundDark dark:text-textDark-primary transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      <div className="relative z-10">
        <Hero />
      </div>

      <div className="relative z-20 bg-background dark:bg-backgroundDark transition-colors duration-300 pb-16">
        <CardCollection
          topTenData={topTenData}
          lastReadData={lastReadData}
          newTitlesData={newTitlesData}
        />

        {/* Call-to-action banner to explore full list */}
        <div className="max-w-7xl mx-auto px-4 mt-12 text-center">
          <div className="p-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 rounded-2xl border border-primary/20 shadow-lg flex flex-col items-center justify-center gap-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Want to see the full list of {comics.length} titles?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-lg">
              Search, filter by genre or status, switch between grid/table views, or export to Excel.
            </p>
            <Link
              to="/all"
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              {(t as Record<string, string>).exploreMore || "Explore All 300+ Titles"} →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
