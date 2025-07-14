"use client";

import { useState } from "react";

// Import các component mới
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
      className={`relative min-h-screen  ${isSearching ? "overflow-hidden" : " overflow-y-auto"}`}
    >
      <FloatingActionButtons />
      <LoanSupport />

      <div className={``}>
        <div className={` ${isSearching ? "" : "relative"}`}>
          <HeroSlider />
          <div
            className={` inset-x-0 z-20 transition-all duration-700 ease-in-out ${
              isSearching
                ? "top-0 h-full fixed overflow-auto"
                : "top-3/4 absolute"
            }`}
          >
            <BookingPage onSearch={handleStartSearch} />
          </div>
        </div>

        {!isSearching && (
          <>
            <main className="relative container z-50 mx-auto mt-[380px] sm:mt-[320px] md:mt-[250px] lg:mt-[200px]">
              <FastBookingForm />
              <KeyFeatures />
            </main>

            <Footer />
          </>
        )}
      </div>

      {/* 
        Container cho trang đặt vé.
        Giữ nguyên hoàn toàn logic và hiệu ứng chuyển cảnh của bạn.
        Nó sẽ chuyển từ giữa màn hình lên trên cùng.
      */}
    </div>
  );
}
