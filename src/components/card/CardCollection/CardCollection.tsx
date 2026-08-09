import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import Modal from "../../modal/Modal";
import { ComicItem } from "../../../services/firebase";
import EvervaultTopTenCard from "../EvervaultTopTenCard";
import DingoLastReadCard from "../DingoLastReadCard";
import InfiniteMovingNewTitles from "../InfiniteMovingNewTitles";
import { motion, Variants } from "framer-motion";

// Register the Navigation module
SwiperCore.use([Navigation]);

interface CardCollectionProps {
  lastReadData: ComicItem[];
  newTitlesData: ComicItem[];
  topTenData: ComicItem[];
}


const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const CardCollection: React.FC<CardCollectionProps> = ({
  lastReadData,
  newTitlesData,
  topTenData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ComicItem | null>(null);

  const openModal = (card: ComicItem) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-7xl h-full mx-auto px-4 space-y-16 pt-8">
      {/* Top 10 Section: Animated Entrance & Evervault Cards */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-8 bg-primary rounded-full" />
          <h2 className="text-3xl font-black text-primary tracking-tight">
            Top 10 Rated
          </h2>
        </div>
        <Swiper
          spaceBetween={16}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          navigation
          style={{ padding: "0.5rem 0.25rem" }}
        >
          {topTenData.map((item, index) => (
            <SwiperSlide key={item.id || index}>
              <motion.div
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <EvervaultTopTenCard
                  item={item}
                  index={index}
                  onClick={() => openModal(item)}
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Last Reading Section: Glowing Glass Cards */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-8 bg-pink-500 rounded-full" />
          <h2 className="text-3xl font-black text-primary tracking-tight">
            Last Reading
          </h2>
        </div>
        <Swiper
          spaceBetween={16}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          navigation
          style={{ padding: "0.5rem 0.25rem" }}
        >
          {lastReadData.map((item, index) => (
            <SwiperSlide key={item.id || index}>
              <motion.div
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <DingoLastReadCard
                  item={item}
                  index={index}
                  onClick={() => openModal(item)}
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* New Add Titles Section: Infinite Moving Marquee Ribbon */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-8 bg-indigo-500 rounded-full" />
          <h2 className="text-3xl font-black text-primary tracking-tight">
            New Add Titles
          </h2>
        </div>
        <InfiniteMovingNewTitles
          items={newTitlesData}
          speed="normal"
          onCardClick={(item) => openModal(item)}
        />
      </motion.div>

      {/* Detail Modal */}
      {selectedCard && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          comic={selectedCard}
        />
      )}
    </div>
  );
};

export default CardCollection;
