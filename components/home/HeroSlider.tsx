"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  bgImage: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Đặt Xe Sang Trọng",
    bgImage: "assets/hero/banner0.jpg",
  },
  {
    id: 2,
    title: "Đặt Xe Nhanh Chóng",
    bgImage: "assets/hero/banner1.jpg",
  },
  {
    id: 3,
    title: "Đặt Xe Nhanh Chóng",
    bgImage: "assets/hero/banner2.jpg",
  },
  {
    id: 4,
    title: "Đặt Xe Nhanh Chóng",
    bgImage: "assets/hero/banner3.jpg",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoplay, slides.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div
      className="relative w-full h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[800px] overflow-hidden group"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Container chứa các ảnh slide */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.bgImage})`,
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Nút điều hướng */}
      <button
        aria-label="Slide trước"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 sm:flex"
        onClick={goToPrevious}
      >
        <ChevronLeft size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      <button
        aria-label="Slide tiếp theo"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 sm:flex"
        onClick={goToNext}
      >
        <ChevronRight size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      {/* Chỉ báo slide */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Đi đến slide ${index + 1}`}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 touch-manipulation ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Gợi ý chạm trên mobile */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white/60 text-xs sm:hidden">
        Chạm để điều hướng
      </div>
    </div>
  );
}
