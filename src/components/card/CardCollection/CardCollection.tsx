import React, { useState } from "react";
import Card from "../Card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import Modal from "../../modal/Modal";

// Register the Navigation module
SwiperCore.use([Navigation]);

import { ComicItem } from "../../../services/firebase";

interface CardCollectionProps {
  lastReadData: ComicItem[];
  newTitlesData: ComicItem[];
  topTenData: ComicItem[];
}

const FALLBACK_COVER = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80";

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
      {/* Top 10 */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-primary">Top 10</h2>
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
              <Card
                onClick={() => openModal(item)}
                index={index}
                img={item.img && item.img.trim() !== "" ? item.img : FALLBACK_COVER}
                title={item.title}
                chapter={item.chapter}
                score={item.rating}
                status={item.status}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Last Read */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6">Last Reading</h2>
        <Swiper
          spaceBetween={10} // Space between the cards
          slidesPerView={3} // Show 3 cards at a time
          navigation
          loop={true}
          style={{ padding: "0 1rem" }} // Add padding to the left and right of the Swiper container
        >
          {lastReadData.map((item, index) => (
            <SwiperSlide key={item.id || index}>
              <Card
                onClick={() => openModal(item)}
                index={index}
                img={item.img && item.img.trim() !== "" ? item.img : FALLBACK_COVER}
                title={item.title}
                chapter={item.chapter}
                score={item.rating}
                status={item.status}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* New Add Titles */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6">New Add Title</h2>
        <Swiper
          spaceBetween={10} // Space between the cards
          slidesPerView={3} // Show 3 cards at a time
          navigation
          loop={true}
          style={{ padding: "0 1rem" }} // Add padding to the left and right of the Swiper container
        >
          {newTitlesData.map((item, index) => (
            <SwiperSlide key={item.id || index}>
              <Card
                onClick={() => openModal(item)}
                index={index}
                img={item.img && item.img.trim() !== "" ? item.img : FALLBACK_COVER}
                title={item.title}
                chapter={item.chapter}
                score={item.rating}
                status={item.status}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
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
