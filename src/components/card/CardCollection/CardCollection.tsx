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

// Register the Navigation module
SwiperCore.use([Navigation]);

interface CardCollectionProps {
  lastReadData: ComicItem[];
  newTitlesData: ComicItem[];
  topTenData: ComicItem[];
}

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
    <div className="w-full max-w-7xl h-full mx-auto px-4">
      {/* Top 10 Section: Evervault Cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-extrabold mb-6 text-primary tracking-tight">Top 10 Rated</h2>
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
              <EvervaultTopTenCard
                item={item}
                index={index}
                onClick={() => openModal(item)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Last Reading Section: Old Dingo 81 Glowing Glass Cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-extrabold mb-6 text-primary tracking-tight">Last Reading</h2>
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
              <DingoLastReadCard
                item={item}
                index={index}
                onClick={() => openModal(item)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* New Add Titles Section: Infinite Moving Marquee Ribbon */}
      <div className="mb-12">
        <h2 className="text-2xl font-extrabold mb-4 text-primary tracking-tight">New Add Titles</h2>
        <InfiniteMovingNewTitles
          items={newTitlesData}
          speed="normal"
          onCardClick={(item) => openModal(item)}
        />
      </div>

      {/* Detail Modal */}
      {selectedCard && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          img={selectedCard.img || "https://via.placeholder.com/150"}
          title={selectedCard.title}
          chapter={selectedCard.chapter}
          score={selectedCard.rating}
          status={selectedCard.status}
        />
      )}
    </div>
  );
};

export default CardCollection;
