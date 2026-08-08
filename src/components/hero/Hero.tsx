import React, { useRef, useState, useEffect } from "react";
import "./Hero.css";
import { useLanguage } from "../../utils/i18n";

import kazumaImg from "../../assets/images/kazuma.jpg";
import tsunaImg from "../../assets/images/tsuna.jpg";
import mikaImg from "../../assets/images/mika_p.jpg";
import teresaImg from "../../assets/images/teresa.jpeg";
import { useTheme } from "../../utils/ThemeProvider";

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const autoRotateSpeed = 0.15;

  const [isInteracting, setIsInteracting] = useState(false);

  const images = [
    { src: kazumaImg, alt: "Kazuma" },
    { src: tsunaImg, alt: "Tsuna" },
    { src: mikaImg, alt: "Mika" },
    { src: teresaImg, alt: "Teresa" },
    { src: kazumaImg, alt: "Kazuma" },
    { src: tsunaImg, alt: "Tsuna" },
    { src: mikaImg, alt: "Mika" },
    { src: teresaImg, alt: "Teresa" },
    { src: mikaImg, alt: "Mika" },
    { src: teresaImg, alt: "Teresa" },
  ];

  useEffect(() => {
    const loop = () => {
      if (!isDragging.current && sliderRef.current) {
        currentRotation.current = (currentRotation.current + autoRotateSpeed) % 360;
        sliderRef.current.style.transform = `perspective(1000px) rotateX(-15deg) rotateY(${currentRotation.current}deg)`;
      }
      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    setIsInteracting(true);
    startX.current = e.clientX;
    if (sliderRef.current) {
      sliderRef.current.style.animation = "none";
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    const deltaX = e.clientX - startX.current;
    startX.current = e.clientX;
    currentRotation.current = (currentRotation.current + deltaX * 0.5) % 360;
    sliderRef.current.style.transform = `perspective(1000px) rotateX(-15deg) rotateY(${currentRotation.current}deg)`;
  };

  const handlePointerUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      setIsInteracting(false);
    }
  };

  const { isDark } = useTheme();

  return (
    <div
      className={`banner touch-pan-y select-none transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-white" : "bg-gray-100 text-gray-900"
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        ref={sliderRef}
        className={`slider ${isInteracting ? "manual-rotate" : ""}`}
        style={{ "--quantity": images.length } as React.CSSProperties}
      >
        {images.map((image, index) => (
          <div
            className="item"
            key={index}
            style={{ "--position": index + 1 } as React.CSSProperties}
          >
            <img src={image.src} alt={image.alt} draggable={false} />
          </div>
        ))}
      </div>
      <div className="content pointer-events-none">
        <div className="author">
          <h3 className={`text-2xl sm:text-3xl text-left font-bold drop-shadow-md ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {t.heroTitle}
          </h3>
          <p className={`text-xs sm:text-sm text-left mt-1 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            {t.heroSubtitle}
          </p>
        </div>
        <div className="model"></div>
      </div>
    </div>
  );
};

export default Hero;
