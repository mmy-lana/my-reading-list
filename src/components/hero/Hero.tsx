import React from "react";
import "./Hero.css";

import kazumaImg from "../../assets/images/kazuma.jpg";
import tsunaImg from "../../assets/images/tsuna.jpg";
import mikaImg from "../../assets/images/mika_p.jpg";
import teresaImg from "../../assets/images/teresa.jpeg";

const Hero: React.FC = () => {
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

  return (
    <div className="banner">
      <div
        className="slider"
        style={{ "--quantity": images.length } as React.CSSProperties}
      >
        {images.map((image, index) => (
          <div
            className="item"
            key={index}
            style={{ "--position": index + 1 } as React.CSSProperties}
          >
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>
      <div className="content">
        {/* <h1 data-content="CSS ONLY">CSS ONLY</h1> */}
        <div className="author">
          <h3 className="text-3xl text-left">M1yuki Reading List</h3>
          {/* <p>
            <b>Web Design</b>
          </p>
          <p>Subscribe to the channel to watch many interesting videos</p> */}
        </div>
        <div className="model"></div>
      </div>
    </div>
  );
};

export default Hero;
