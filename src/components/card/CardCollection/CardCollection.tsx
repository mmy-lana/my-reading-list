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

interface CardData {
  img: string;
  title: string;
  chapter: number;
  score: number;
  status: string;
}

interface CardCollectionProps {
  lastReadData: CardData[];
  newTitlesData: CardData[];
  topTenData: CardData[];
}

const CardCollection: React.FC<CardCollectionProps> = ({
  lastReadData,
  newTitlesData,
  topTenData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const openModal = (card: CardData) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  return (
    <div className="w-3/4 h-full mx-auto">
      {/* Top 10 */}
      <div className="mb-8 mt-20">
        <h2 className="text-xl font-bold mb-6">Top 10</h2>
        <Swiper
          spaceBetween={10} // Space between the cards
          slidesPerView={3} // Show 3 cards at a time
          navigation
          loop={true}
          style={{ padding: "0 1rem" }} // Add padding to the left and right of the Swiper container
        >
          {topTenData.map((item, index) => (
            <SwiperSlide key={index}>
              <Card
                onClick={() => openModal(item)}
                index={index}
                img={item.img}
                title={item.title}
                chapter={item.chapter}
                score={item.score}
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
            <SwiperSlide key={index}>
              <Card
                onClick={() => openModal(item)}
                index={index}
                img={item.img}
                title={item.title}
                chapter={item.chapter}
                score={item.score}
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
            <SwiperSlide key={index}>
              <Card
                onClick={() => openModal(item)}
                index={index}
                img={item.img}
                title={item.title}
                chapter={item.chapter}
                score={item.score}
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
          img={selectedCard.img}
          title={selectedCard.title}
          chapter={selectedCard.chapter}
          score={selectedCard.score}
          status={selectedCard.status}
        />
      )}
    </div>
  );
};

export default CardCollection;
