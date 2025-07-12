"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  // Giữ lại title để dùng cho 'alt' text của ảnh, tốt cho SEO và người dùng khiếm thị
  title: string;
  bgImage: string;
}

// --- DỮ LIỆU ĐÃ ĐƯỢC RÚT GỌN ---
const slides: Slide[] = [
  {
    id: 1,
    title: "Đặt Xe Sang Trọng",
    bgImage: "assets/hero/banner1.jpg",
  },
  {
    id: 2,
    title: "Đặt Xe Nhanh Chóng",
    bgImage: "assets/hero/banner1.jpg",
  },
  {
    id: 3,
    title: "An Toàn & Tin Cậy",
    bgImage: "assets/hero/banner1.jpg",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Tự động chuyển slide
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoplay]);

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
      className="relative h-[500px] md:h-[700px] overflow-hidden group"
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
            {/* 
              SỬ DỤNG THẺ IMG ĐỂ HIỂN THỊ ẢNH
              - 'object-cover': Phóng to ảnh để lấp đầy khung hình, có thể cắt bớt các cạnh. Đây là lựa chọn tốt nhất cho hero slider.
              - 'alt': Mô tả ảnh, rất quan trọng cho SEO và người dùng khiếm thị.
            */}
            <img
              src={slide.bgImage}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* 
        Nút Điều Hướng và Chỉ Báo Slide được giữ lại. 
        Chúng chỉ hiện lên khi người dùng di chuột vào slider, không che ảnh khi xem bình thường.
      */}
      <button
        aria-label="Slide trước"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
        onClick={goToPrevious}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        aria-label="Slide tiếp theo"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
        onClick={goToNext}
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Đi đến slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
