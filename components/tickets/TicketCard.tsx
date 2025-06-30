// src/components/tickets/TicketCard.tsx
"use client";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { Ticket } from "@/types";

interface TicketCardProps {
  ticket: Ticket;
  onCancel: (ticketId: string) => void;
  onViewDetails: (ticket: Ticket) => void;
}

const statusMap = {
  Confirmed: { text: "Đã xác nhận", color: "success" as const },
  Done: { text: "Đã xác nhận", color: "success" as const },
  Pending: { text: "Chờ xác nhận", color: "warning" as const },
  Cancelled: { text: "Đã hủy", color: "danger" as const },
};

export const TicketCard = ({
  ticket,
  onCancel,
  onViewDetails,
}: TicketCardProps) => {
  const statusInfo = statusMap[ticket.status] || {
    text: "Không xác định",
    color: "default",
  };
  const isCancellable = ticket.status !== "Cancelled";

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-md font-semibold">{ticket.tripInfo.station}</p>
          <p className="text-sm text-gray-500">
            Hành khách: {ticket.passengerName}
          </p>
        </div>
        <Chip color={statusInfo.color} variant="flat">
          {statusInfo.text}
        </Chip>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Ngày đi:</span>
          {/* SỬA LẠI: Dùng new Date() để parse chuỗi thời gian */}
          <span className="font-semibold">
            {format(new Date(ticket.tripInfo.startTime), "EEEE, dd/MM/yyyy", {
              locale: vi,
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Giờ đi:</span>
          <span className="font-semibold">
            {format(new Date(ticket.tripInfo.startTime), "HH:mm")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Ghế đã chọn:</span>
          <span className="font-semibold text-primary">
            {ticket.seats.map((s) => s.code).join(", ")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tổng tiền:</span>
          <span className="font-bold text-danger">
            {ticket.tripInfo.price.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="gap-2">
        <Button
          fullWidth
          color="primary"
          variant="flat"
          onPress={() => onViewDetails(ticket)}
        >
          Xem chi tiết
        </Button>
        <Button
          fullWidth
          color="danger"
          isDisabled={!isCancellable}
          variant="bordered"
          onPress={() => onCancel(ticket._id)}
        >
          Hủy vé
        </Button>
      </CardFooter>
    </Card>
  );
};
