// src/app/page.tsx
"use client";

import { useState } from "react";

import BookingPage from "@/components/booking/BookingPage";
import HeroSlider from "@/components/home/HeroSlider";
import Footer from "@/components/home/Footer";
import FloatingActionButtons from "@/components/common/FloatingActionButtons";
import LoanSupport from "@/components/common/LoanSupport";

export default function Page() {
  const [isSearching, setIsSearching] = useState(false);

  const handleStartSearch = () => {
    setIsSearching(true);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Các component nổi sẽ nằm ở đây để luôn hiển thị */}
      <FloatingActionButtons />
      <LoanSupport />

      <div
        className={`transition-all duration-700 ease-in-out ${
          isSearching ? "h-0 opacity-0" : "h-full opacity-100"
        }`}
      >
        <HeroSlider />
      </div>

      <div
        className={`absolute inset-x-0 z-10 transition-all duration-700 ease-in-out ${
          isSearching ? "top-0 h-full" : "top-1/2"
        }`}
      >
        <BookingPage onSearch={handleStartSearch} />
      </div>

      {/* Ẩn Footer đi khi đang tìm kiếm để có không gian */}
      <div
        className={`transition-opacity duration-500 ${
          isSearching ? "opacity-0" : "opacity-100"
        }`}
      >
        <Footer />
      </div>
    </div>
  );
}
