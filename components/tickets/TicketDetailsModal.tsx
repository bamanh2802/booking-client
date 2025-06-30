"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Card } from "@heroui/card";

import { Ticket } from "@/types";

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

const statusMap = {
  Confirmed: { text: "Đã xác nhận", color: "success" as const },
  Pending: { text: "Chờ xác nhận", color: "warning" as const },
  Cancelled: { text: "Đã hủy", color: "danger" as const },
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between items-start">
    <p className="text-sm text-gray-500">{label}:</p>
    <p className="text-sm font-semibold text-right">{value}</p>
  </div>
);

export const TicketDetailsModal = ({
  isOpen,
  onClose,
  ticket,
}: TicketDetailsModalProps) => {
  // Không render gì nếu không có vé được chọn
  if (!ticket) return null;

  const statusInfo = statusMap[ticket.status] || {
    text: "Không xác định",
    color: "default",
  };

  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex justify-between items-center">
              <span className="text-lg font-bold">
                Chi tiết vé #{ticket._id.slice(-6)}
              </span>
              <Chip color={statusInfo.color} variant="flat">
                {statusInfo.text}
              </Chip>
            </ModalHeader>
            <ModalBody className="space-y-4">
              <Card className="p-3 bg50 rounded-lg">
                <h3 className="font-bold text-md mb-2">Thông tin chuyến đi</h3>
                <div className="space-y-2">
                  <DetailRow
                    label="Tuyến đường"
                    value={ticket.tripInfo.station}
                  />
                  <DetailRow
                    label="Ngày đi"
                    value={format(
                      new Date(ticket.tripInfo.startTime),
                      "EEEE, dd/MM/yyyy",
                      { locale: vi },
                    )}
                  />
                  <DetailRow
                    label="Giờ khởi hành"
                    value={format(new Date(ticket.tripInfo.startTime), "HH:mm")}
                  />
                  <DetailRow
                    label="Giờ dự kiến đến"
                    value={format(new Date(ticket.tripInfo.endTime), "HH:mm")}
                  />
                  <DetailRow
                    label="Thời gian di chuyển"
                    value={ticket.tripInfo.time}
                  />
                </div>
              </Card>

              {/* Thông tin hành khách */}
              <Card className="p-3  rounded-lg">
                <h3 className="font-bold text-md mb-2">Thông tin hành khách</h3>
                <div className="space-y-2">
                  <DetailRow label="Họ và tên" value={ticket.passengerName} />
                  <DetailRow
                    label="Số điện thoại"
                    value={ticket.passengerPhone}
                  />
                  <DetailRow
                    label="Ghế đã chọn"
                    value={
                      <span className="text-primary font-bold">
                        {ticket.seats.map((s) => s.code).join(", ")}
                      </span>
                    }
                  />
                  <DetailRow label="Loại vé" value={ticket.type} />
                </div>
              </Card>

              {/* Thông tin nhà xe và thanh toán */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-3  rounded-lg">
                  <h3 className="font-bold text-md mb-2">Nhà xe</h3>
                  <DetailRow
                    label="Tên nhà xe"
                    value={ticket.carCompanyInfo.name}
                  />
                  <DetailRow
                    label="Hotline"
                    value={
                      <a
                        className="text-primary hover:underline"
                        href={`tel:${ticket.carCompanyInfo.hotline}`}
                      >
                        {ticket.carCompanyInfo.hotline}
                      </a>
                    }
                  />
                </Card>
                <Card className="p-3  rounded-lg">
                  <h3 className="font-bold text-md mb-2">Thanh toán</h3>
                  <DetailRow
                    label="Tổng tiền"
                    value={
                      <span className="text-danger font-bold">
                        {ticket.tripInfo.price.toLocaleString("vi-VN")}đ
                      </span>
                    }
                  />
                  <DetailRow
                    label="Ngày đặt"
                    value={format(
                      new Date(ticket.createdAt),
                      "dd/MM/yyyy HH:mm",
                    )}
                  />
                </Card>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={close}>
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
