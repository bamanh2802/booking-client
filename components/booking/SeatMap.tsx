// src/components/SeatMap.tsx

import { useState } from "react";
import { Input } from "@heroui/input";
// import { Select, SelectItem } from "@heroui/select"; // Không cần dùng Select nữa
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { addToast } from "@heroui/toast";

import { BookingDetails } from "./BookingSuccessModal";

import { Seat } from "@/types";
import { requestNewTicket } from "@/services/booking";
import { useAppSelector } from "@/lib/hook";
import { selectCurrentUser } from "@/store/slices/authSlice";
interface SeatMapProps {
  layout: Seat[];
  booked: Seat[];
  selected: Seat[];
  onSelect: (seats: Seat[]) => void;
  tripId: string;
  tripType: string;
  max?: number;
  price: number;
  onBookingSuccess: (details: BookingDetails) => void;
}

export function SeatMap({
  layout,
  booked,
  selected,
  onSelect,
  tripId,
  tripType,
  max = 4,
  price,
  onBookingSuccess,
}: SeatMapProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_, setIsSuccessModalOpen] = useState(true);
  const [customer, setCustomer] = useState({
    phone: "",
    name: "",
    email: "",
    pickup: "",
    dropoff: "",
  });

  const user = useAppSelector(selectCurrentUser);

  const getPhoneValidationError = (phone: string): string | null => {
    const trimmed = phone.trim();

    if (!trimmed) return "Vui lòng nhập số điện thoại";
    if (!/^0\d{9}$/.test(trimmed)) return "Số điện thoại không đúng định dạng";

    return null;
  };
  const getEmailValidationError = (email: string): string | null => {
    const trimmed = email.trim();

    if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return "Email không đúng định dạng";
    }

    return null;
  };

  const phoneError = getPhoneValidationError(customer.phone);
  const emailError = getEmailValidationError(customer.email);

  const handleCustomerChange = (field: string, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  // --- MODIFIED: Cập nhật logic validation cho các trường input mới ---
  const isFormValid =
    selected.length > 0 &&
    customer.name.trim() !== "" &&
    customer.pickup.trim() !== "" && // Sửa ở đây
    customer.dropoff.trim() !== "" && // Sửa ở đây
    !phoneError &&
    !emailError;

  const getSeatStatus = (seat: Seat) => {
    if (booked.some((b) => b.code === seat.code && b.floor === seat.floor))
      return "booked";
    if (selected.some((s) => s.code === seat.code && s.floor === seat.floor))
      return "selected";

    return "empty";
  };

  const handleClickSeat = (seat: Seat) => {
    if (getSeatStatus(seat) === "booked") return;
    const isCurrentlySelected = selected.some(
      (s) => s.code === seat.code && s.floor === seat.floor
    );

    if (isCurrentlySelected) {
      onSelect(
        selected.filter(
          (s) => !(s.code === seat.code && s.floor === seat.floor)
        )
      );
    } else {
      if (selected.length < max) onSelect([...selected, seat]);
      else
        addToast({
          title: "Giới hạn số ghế",
          description: `Bạn chỉ có thể chọn tối đa ${max} ghế.`,
          color: "warning",
        });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      addToast({
        title: "Thông tin chưa hợp lệ",
        description: "Vui lòng điền đầy đủ các trường bắt buộc.",
        color: "danger",
      });

      return;
    }
    if (!user?._id) {
      addToast({
        title: "Yêu cầu đăng nhập",
        description: "Bạn cần đăng nhập để thực hiện chức năng này.",
        color: "danger",
      });

      return;
    }

    setIsSubmitting(true);
    try {
      await requestNewTicket(
        user._id,
        tripId,
        "Pending",
        "Book Ticket",
        selected,
        customer.name,
        customer.phone,
        tripType,
        price.toString()
      );
      addToast({
        title: "Thành công!",
        description: "Yêu cầu đặt vé của bạn đã được gửi đi.",
        color: "success",
      });

      setIsSuccessModalOpen(true);
      onBookingSuccess({
        customerName: customer.name,
        customerPhone: customer.phone,
        selectedSeats: selected.map((s) => s.code),
        pickupPoint: customer.pickup,
        dropoffPoint: customer.dropoff,
        totalPrice: price,
      });
    } catch (error) {
      addToast({
        title: "Đặt vé thất bại",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        color: "danger",
      });
      console.error("Booking failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const floor1 = layout.filter((s) => s.floor === 1);
  const floor2 = layout.filter((s) => s.floor === 2);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Phần chọn ghế không thay đổi */}
        <Card className="flex-1">
          <CardBody className="p-4">
            <div className="flex flex-col sm:flex-row gap-6">
              {[floor1, floor2].map(
                (floorArr, idx) => {
                  if (floorArr.length === 0) return null;

                  // 1. Nhóm các ghế theo cột (A, B, C, ...)
                  const seatsByColumn = floorArr.reduce((acc, seat) => {
                    const columnKey = seat.code.charAt(0); // Lấy ký tự đầu tiên (A, B)
                    if (!acc[columnKey]) {
                      acc[columnKey] = [];
                    }
                    acc[columnKey].push(seat);
                    // Sắp xếp các ghế trong cột theo số thứ tự
                    acc[columnKey].sort((a, b) => parseInt(a.code.slice(1)) - parseInt(b.code.slice(1)));
                    return acc;
                  }, {} as Record<string, Seat[]>);

                  return (
                    <div key={idx} className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                        Tầng {idx + 1}
                      </h3>
                      {/* 2. Render các cột ghế bằng flexbox */}
                      <div className="flex justify-center gap-4 sm:gap-6">
                        {/* Sắp xếp các cột theo thứ tự alphabet (A, B, ...) */}
                        {Object.keys(seatsByColumn).sort().map((columnKey) => (
                          // Mỗi cột là một flex container dọc
                          <div key={columnKey} className="flex flex-col gap-2">
                            {seatsByColumn[columnKey].map((seat) => {
                              const status = getSeatStatus(seat);
                              return (
                                <Tooltip
                                  key={`${seat.code}-${seat.floor}`}
                                  content={
                                    status === "booked"
                                      ? "Đã đặt"
                                      : `Ghế ${seat.code}`
                                  }
                                  placement="top"
                                >
                                  <Button
                                    isIconOnly
                                    className={`w-10 h-10 rounded-lg font-medium text-sm ${
                                      status === "booked"
                                        ? "bg-red-100 text-red-600 cursor-not-allowed"
                                        : status === "selected"
                                          ? "bg-yellow-400 text-yellow-800"
                                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                    }`}
                                    isDisabled={status === "booked" || isSubmitting}
                                    size="sm"
                                    onPress={() => handleClickSeat(seat)}
                                  >
                                    {seat.code}
                                  </Button>
                                </Tooltip>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            <div className="flex gap-4 mt-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-600 rounded" />
                <span>Trống</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-600 rounded" />
                <span>Đã đặt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 border border-yellow-800 rounded" />
                <span>Đang chọn</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Phần form thông tin khách hàng đã được cập nhật */}
        <Card className="flex-1 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">
            Thông tin khách hàng
          </h3>
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <Input
              isRequired
              errorMessage={customer.phone ? phoneError : undefined}
              isDisabled={isSubmitting}
              label="Số điện thoại"
              placeholder="0xxxxxxxxx"
              startContent={<span className="text-danger">*</span>}
              value={customer.phone}
              onValueChange={(v) => handleCustomerChange("phone", v)}
            />
            <Input
              isRequired
              isDisabled={isSubmitting}
              label="Họ tên"
              placeholder="Nhập họ tên"
              startContent={<span className="text-danger">*</span>}
              value={customer.name}
              onValueChange={(v) => handleCustomerChange("name", v)}
            />
            <Input
              errorMessage={customer.email ? emailError : undefined}
              isDisabled={isSubmitting}
              label="Email"
              placeholder="example@gmail.com"
              type="email"
              value={customer.email}
              onValueChange={(v) => handleCustomerChange("email", v)}
            />

            {/* --- MODIFIED: Thay thế Select bằng Input --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                isRequired
                isDisabled={isSubmitting}
                label="Điểm đón"
                placeholder="Nhập địa chỉ, tòa nhà,..."
                startContent={<span className="text-danger">*</span>}
                value={customer.pickup}
                onValueChange={(v) => handleCustomerChange("pickup", v)}
              />
              <Input
                isRequired
                isDisabled={isSubmitting}
                label="Điểm trả"
                placeholder="Nhập địa chỉ mong muốn,..."
                startContent={<span className="text-danger">*</span>}
                value={customer.dropoff}
                onValueChange={(v) => handleCustomerChange("dropoff", v)}
              />
            </div>

            <Button
              className="w-full"
              color="primary"
              isDisabled={!isFormValid || isSubmitting}
              isLoading={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Đang xử lý..." : "Đặt vé"}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
