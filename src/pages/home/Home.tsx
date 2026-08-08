import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Hero from "../../components/hero/Hero";
import CardCollection from "../../components/card/CardCollection/CardCollection";
import Footer from "../../components/footer/Footer";
import { fetchAllComics } from "../../services/comicService";
import { ComicItem } from "../../services/firebase";
import { Link } from "react-router-dom";
import { useLanguage } from "../../utils/i18n";
import { useTheme } from "../../utils/ThemeProvider";

const Home: React.FC = () => {
  const [comics, setComics] = useState<ComicItem[]>([]);
  const { t } = useLanguage();
  const { isDark } = useTheme();

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
    <div className={`relative min-h-screen transition-colors duration-300 overflow-x-hidden ${
      isDark ? "bg-slate-950 text-gray-100" : "bg-gray-50 text-gray-900"
    }`}>
      <Navbar />

      <div className="relative z-10">
        <Hero />
      </div>

      <div className={`relative z-20 transition-colors duration-300 pb-16 ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      }`}>
        <CardCollection
          topTenData={topTenData}
          lastReadData={lastReadData}
          newTitlesData={newTitlesData}
        />

        {/* Call-to-action banner to explore full list */}
        <div className="max-w-7xl mx-auto px-4 mt-12 text-center">
          <div className={`p-8 rounded-2xl border shadow-lg flex flex-col items-center justify-center gap-4 ${
            isDark
              ? "bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 border-primary/30"
              : "bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border-primary/20"
          }`}>
            <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Want to see the full list of {comics.length} titles?
            </h3>
            <p className={`text-sm max-w-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
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
