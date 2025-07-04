// src/components/booking/CallBackForm.tsx
"use client";

import { useState } from "react";

const CallBackForm = () => {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      alert("Vui lòng nhập số điện thoại.");
      return;
    }
    // Logic gửi yêu cầu
    alert(
      `Yêu cầu gọi lại cho số ${phone} đã được ghi nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất!`
    );
    setPhone("");
  };

  return (
    <div className="mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-lg">
      <p className="text-center text-white font-semibold mb-4">
        Không cần phải đăng ký tài khoản hay đăng nhập - Hãy để lại số điện
        thoại, chúng tôi sẽ gọi lại để hỗ trợ bạn đặt vé!
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Số điện thoại của bạn"
          className="flex-grow px-4 py-2 text-gray-800 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors"
        >
          Gửi
        </button>
      </form>
    </div>
  );
};

export default CallBackForm;
