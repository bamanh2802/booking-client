// src/components/home/IntroductionSection.tsx
import React from "react";

export const IntroductionSection = () => {
  return (
    <section
      aria-labelledby="introduction-heading"
      className="py-12 md:py-16 bg-default-50 dark:bg-default-100"
    >
      {" "}
      {/* Màu nền nhẹ */}
      <div className="container mx-auto px-4">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8"
          id="introduction-heading"
        >
          Về Chúng Tôi - BookingCar
        </h2>
        <div className="max-w-3xl mx-auto text-center text-default-700 dark:text-default-300 space-y-4">
          {/* --- PHẦN PLACEHOLDER --- */}
          <p>
            [Placeholder] Giới thiệu về sứ mệnh, tầm nhìn của website
            BookingCar. Nhấn mạnh sự tiện lợi, nhanh chóng và đáng tin cậy khi
            đặt vé qua nền tảng này.
          </p>
          <p>
            [Placeholder] Mô tả các loại hình dịch vụ chính: xe khách liên tỉnh,
            xe limousine, xe hợp đồng (nếu có). Liệt kê các đối tác nhà xe uy
            tín.
          </p>
          <p>
            [Placeholder] Lợi ích chính cho khách hàng: đa dạng lựa chọn, giá cả
            cạnh tranh, thanh toán an toàn, hỗ trợ khách hàng 24/7, các chương
            trình khuyến mãi hấp dẫn.
          </p>
          {/* --- KẾT THÚC PLACEHOLDER --- */}
        </div>
      </div>
    </section>
  );
};
