"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

const SuccessIcon = () => (
  <svg
    className="h-16 w-16 text-success mx-auto"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface BookingDetails {
  customerName: string;
  customerPhone: string;
  selectedSeats: string[];
  pickupPoint: string;
  dropoffPoint: string;
  totalPrice: number;
}

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: BookingDetails | null;
}

export const BookingSuccessModal = ({
  isOpen,
  onClose,
  bookingDetails,
}: BookingSuccessModalProps) => {
  const router = useRouter();

  if (!bookingDetails) return null;

  const handleViewHistory = () => {
    onClose();
    router.push("/my-tickets");
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1 items-center text-xl font-bold text-success-600 pt-6">
              Yêu Cầu Đặt Vé Thành Công!
            </ModalHeader>
            <ModalBody className="py-6 px-8 text-center">
              <SuccessIcon />
              <p className="mt-4 text-foreground">
                Yêu cầu của bạn đã được ghi nhận. Vui lòng đợi nhân viên gọi
                điện xác nhận trong vài phút tới.
              </p>

              <div className="mt-6 p-4 bg-default-100 rounded-lg text-left space-y-2 text-sm">
                <h4 className="font-semibold text-center mb-3 text-base">
                  Thông tin yêu cầu
                </h4>
                <div className="flex justify-between">
                  <span className="text-default-600">Họ tên:</span>
                  <span className="font-semibold text-foreground">
                    {bookingDetails.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Số điện thoại:</span>
                  <span className="font-semibold text-foreground">
                    {bookingDetails.customerPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Ghế đã chọn:</span>
                  <span className="font-bold text-primary">
                    {bookingDetails.selectedSeats.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Tổng tiền:</span>
                  <span className="font-semibold text-foreground">
                    {bookingDetails.totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={close}>
                Đóng
              </Button>
              <Button color="primary" onPress={handleViewHistory}>
                Xem Lịch Sử Đặt Vé
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
