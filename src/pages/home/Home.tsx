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

import { motion } from "framer-motion";
import SmoothScroll from "../../utils/SmoothScroll";

const Home: React.FC = () => {
  const [comics, setComics] = useState<ComicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { isDark } = useTheme();

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
    <SmoothScroll>
      <div className={`relative min-h-screen transition-colors duration-300 overflow-x-hidden ${
        isDark ? "bg-slate-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}>
        <Navbar />

        <div className="relative z-10">
          <Hero />
        </div>

        <div className={`relative z-20 transition-colors duration-300 pb-20 ${
          isDark ? "bg-slate-950" : "bg-gray-50"
        }`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-slate-500 animate-pulse">Initializing Collection & Animations...</p>
            </div>
          ) : (
            <>
              <CardCollection
                topTenData={topTenData}
                lastReadData={lastReadData}
                newTitlesData={newTitlesData}
              />

              {/* Parallax & Animated CTA Banner */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-7xl mx-auto px-4 mt-16 text-center"
              >
                <div className={`p-10 rounded-3xl border shadow-2xl relative overflow-hidden flex flex-col items-center justify-center gap-5 backdrop-blur-xl ${
                  isDark
                    ? "bg-slate-900/80 border-primary/30 text-white"
                    : "bg-white/90 border-primary/20 text-gray-900"
                }`}>
                  <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                  <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-primary/20 text-primary border border-primary/30">
                    Live Collection Stats
                  </span>

                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl">
                    Explore All {comics.length} Handpicked Titles
                  </h3>

                  <p className={`text-sm max-w-xl leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    Filter by genre or status, toggle between interactive grid and detailed spreadsheet views, or export formatted Excel datasets.
                  </p>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/all"
                      className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-2xl shadow-xl transition-all duration-300 inline-flex items-center gap-2"
                    >
                      {(t as Record<string, string>).exploreMore || "Explore Full Collection"} →
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Home;
