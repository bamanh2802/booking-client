"use client";

import { useState } from "react";

// Import các component
import FastBookingForm from "@/components/common/FastBookingForm";
import KeyFeatures from "@/components/common/KeyFeatures";
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
    <div
      className={`relative min-h-screen bg-gray-50 ${isSearching ? "overflow-hidden" : "overflow-y-auto"}`}
    >
      <FloatingActionButtons />
      <LoanSupport />

      {/* 
        CHÌA KHÓA #1: HERO SLIDER VÀ BOOKING PAGE
        - Chúng được đặt trong một `div` riêng, không có class "container" hay "px-4".
        - Điều này cho phép HeroSlider chiếm 100% chiều rộng màn hình.
      */}
      <div className="relative">
        <HeroSlider />
        <div
          className={`w-full inset-x-0 z-20 transition-all duration-700 ease-in-out ${
            isSearching
              ? "top-0 h-full fixed overflow-auto bg-white"
              : "top-3/4 absolute"
          }`}
        >
          {/* BookingPage được đặt trong container để căn giữa form */}
          <div className="container mx-auto px-4">
            <BookingPage onSearch={handleStartSearch} />
          </div>
        </div>
      </div>

      {/* 
        CHÌA KHÓA #2: NỘI DUNG CHÍNH
        - Chỉ phần nội dung này mới được bọc trong <main> với class "container".
        - Nó được kéo lên bằng margin-top âm để tạo hiệu ứng "gối đầu" lên slider.
      */}
      {!isSearching && (
        <>
          <main className="relative container mx-auto px-4 z-10 -mt-24 md:-mt-16">
            <FastBookingForm />
            <KeyFeatures />
          </main>

          {/* Footer có thể là full-width hoặc trong container tùy thiết kế */}
          <Footer />
        </>
      )}
    </div>
  );
}
