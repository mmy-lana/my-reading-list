import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Hero from "../../components/hero/Hero";
import CardCollection from "../../components/card/CardCollection/CardCollection";
import PublicReadList from "../../components/list/PublicReadList";
import Footer from "../../components/footer/Footer";
import { fetchAllComics } from "../../services/comicService";
import { ComicItem } from "../../services/firebase";

const Home: React.FC = () => {
  const [comics, setComics] = useState<ComicItem[]>([]);

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
    <div className="relative min-h-screen bg-background text-text-primary dark:bg-backgroundDark dark:text-textDark-primary transition-colors duration-300">
      <Navbar />

      <div className="relative z-10 sticky top-0 transition-all duration-500">
        <Hero />
      </div>

      <div className="relative z-20 -mt-16 bg-background/95 dark:bg-backgroundDark/95 backdrop-blur-md rounded-t-3xl shadow-2xl transition-all duration-300">
        <div className="pt-8">
          <CardCollection
            topTenData={topTenData}
            lastReadData={lastReadData}
            newTitlesData={newTitlesData}
          />
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <PublicReadList comics={comics} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
