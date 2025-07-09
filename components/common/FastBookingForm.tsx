"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Phone, Send } from "lucide-react";
import { addToast } from "@heroui/toast"; // Giả định bạn đã có hàm này
import { createFastAction } from "@/services/requests";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { useAppSelector } from "@/lib/hook";

export default function FastBookingForm() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAppSelector(selectCurrentUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- NEW: Validation phía client ---
    if (!phoneNumber.trim() || !/^\d{10,11}$/.test(phoneNumber)) {
      setError("Vui lòng nhập số điện thoại hợp lệ (10-11 số).");
      return;
    }
    setError(null); // Xóa lỗi cũ nếu hợp lệ

    setIsLoading(true);
    try {
      await createFastAction(phoneNumber, "Assist Book Ticket", user._id);

      // --- NEW: Thông báo thành công ---
      addToast({
        title: "Yêu cầu đã được gửi!",
        description:
          "Cảm ơn bạn. Chuyên viên của chúng tôi sẽ gọi lại trong ít phút.",
        color: "success",
        icon: "lucide:check-circle",
      });

      setPhoneNumber(""); // Reset form sau khi thành công
    } catch (e) {
      console.error(e);
      // --- NEW: Thông báo lỗi từ server ---
      addToast({
        title: "Gửi yêu cầu thất bại",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        color: "danger",
        icon: "lucide:x-circle",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (value: string) => {
    setPhoneNumber(value);
    // Xóa lỗi ngay khi người dùng bắt đầu sửa
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="py-12 px-4 w-full">
      <Card
        className="p-8 shadow-xl border-transparent
                   bg-gradient-to-br from-white to-gray-100
                   dark:from-gray-800 dark:to-black dark:border-gray-700"
      >
        <CardBody>
          <h3 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            Đặt Xe Nhanh
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Không cần đăng ký tài khoản hay đăng nhập - chỉ cần để lại số điện
            thoại, chúng tôi sẽ gọi lại để hỗ trợ bạn đặt vé!
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <Input
              type="tel"
              value={phoneNumber}
              onValueChange={handleValueChange} // Sử dụng hàm mới
              placeholder="Nhập số điện thoại của bạn"
              startContent={<Phone className="text-gray-400" />}
              size="lg"
              // --- NEW: Hiển thị lỗi ngay trên Input ---
              isInvalid={!!error}
              errorMessage={error}
              classNames={{
                inputWrapper: [
                  "border-2",
                  // Light mode styles
                  "bg-white/50 border-gray-200 hover:border-primary-300",
                  // Dark mode styles
                  "dark:bg-white/10 dark:border-white/20 dark:hover:border-primary-400",
                ],
                input: "dark:text-white",
              }}
              isRequired
            />
            <Button
              type="submit"
              size="lg"
              color="primary"
              className="font-bold shadow-lg shadow-primary/30"
              isLoading={isLoading}
              startContent={!isLoading && <Send size={20} />}
            >
              Đặt Vé
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
