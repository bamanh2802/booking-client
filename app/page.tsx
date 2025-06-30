// src/app/page.tsx
"use client";

import { useState } from "react";

import BookingPage from "@/components/booking/BookingPage";
import HeroSlider from "@/components/home/HeroSlider";
import Footer from "@/components/home/Footer";

export default function Page() {
  const [isSearching, setIsSearching] = useState(false);

  // Hàm callback sẽ được truyền xuống BookingPage
  const handleStartSearch = () => {
    setIsSearching(true);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className={`transition-all duration-700 ease-in-out ${
          isSearching ? "h-0" : "h-full"
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

      <Footer />
    </div>
  );
}
