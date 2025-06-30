"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  bgImage: string;
  features: string[];
}

// --- DỮ LIỆU ĐÃ ĐƯỢC DỊCH SANG TIẾNG VIỆT ---
const slides: Slide[] = [
  {
    id: 1,
    title: "Đặt Xe Sang Trọng",
    subtitle: "Dàn Xe Cao Cấp Phục Vụ Bạn",
    description:
      "Trải nghiệm sự thoải mái tuyệt đối với bộ sưu tập xe cao cấp và tài xế chuyên nghiệp của chúng tôi.",
    bgImage: "assets/hero/banner.jpg",
    features: ["Tài xế 5 sao", "Xe hạng sang", "Hỗ trợ 24/7"],
  },
  {
    id: 2,
    title: "Đặt Xe Nhanh Chóng",
    subtitle: "Trải Nghiệm Dễ Dàng",
    description:
      "Hệ thống đặt xe trực quan của chúng tôi giúp bạn lên đường nhanh hơn bao giờ hết.",
    bgImage: "assets/hero/banner.jpg",
    features: [
      "Đặt xe tức thì",
      "Theo dõi thời gian thực",
      "Lịch trình linh hoạt",
    ],
  },
  {
    id: 3,
    title: "An Toàn & Tin Cậy",
    subtitle: "An Toàn Của Bạn, Ưu Tiên Của Chúng Tôi",
    description:
      "Tận hưởng chuyến đi với sự an tâm tuyệt đối, biết rằng bạn đang ở trong những vòng tay an toàn nhất.",
    bgImage: "assets/hero/banner.jpg",
    features: ["Tài xế được xác minh", "Theo dõi GPS", "Có bảo hiểm"],
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
    }, 6000); // Giữ nguyên thời gian tự động chuyển

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

  const currentSlideData = slides[currentSlide];

  return (
    <div
      className="relative h-[500px] md:h-[600px] overflow-hidden group"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Hình Nền */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Ảnh nền */}
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />
            {/* Lớp phủ màu đen để làm nổi bật chữ */}
            <div className="absolute inset-0 bg-black/10" />
          </div>
        ))}
      </div>

      {/* Nút Điều Hướng */}
      <button
        aria-label="Slide trước"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
        onClick={goToPrevious}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        aria-label="Slide tiếp theo"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
        onClick={goToNext}
      >
        <ChevronRight size={24} />
      </button>

      {/* Chỉ Báo Slide (dạng chấm tròn đơn giản) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Đi đến slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
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
