import { useState } from "react";
import Image from "next/image";

export default function ImgSliderWrapper({ images = [], title }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const hasMultiple = images.length > 1;

  const goNext = () => setIndex((prev) => (prev + 1) % images.length);
  const goPrev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  // Normalize the image
  const raw = images[index];
  const current = typeof raw === "string" ? { url: raw, credits: null } : raw;

  return (
    <div className="slider-outer">
      <div className="slider-inner">

        {/* Main Image */}
        <Image
          src={current.url}
          alt={title}
          fill
          className="slider-image"
          onClick={hasMultiple ? goNext : undefined}
          style={{ cursor: hasMultiple ? "pointer" : "default" }}
        />

        {/* Credits */}
        {current.credits && (
          <div className="slider-credits">{current.credits}</div>
        )}

        {/* Only show counter & arrows if there are multiple images */}
        {hasMultiple && (
          <>
            <div className="slider-counter">
              {index + 1} / {images.length}
            </div>

            <button className="slider-btn left" onClick={goPrev}>‹</button>
            <button className="slider-btn right" onClick={goNext}>›</button>
          </>
        )}
      </div>
    </div>
  );
}
