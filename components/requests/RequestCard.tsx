// src/components/request/RequestCard.tsx

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { format } from "date-fns";
import { Ticket, DollarSign, Calendar, Info } from "lucide-react";

import { TicketRequest } from "@/types";

interface RequestCardProps {
  request: TicketRequest;
  onCancel: (requestId: string) => void;
  onViewDetails: (request: TicketRequest) => void;
}

const statusMap = {
  Pending: { label: "Chờ xử lý", color: "warning" as const },
  Confirmed: { label: "Đã xác nhận", color: "success" as const },
  Cancelled: { label: "Đã hủy", color: "danger" as const },
  // Thêm các status khác nếu cần
};

// --- SUB-COMPONENT: Hiển thị chi tiết cho Yêu cầu Đặt vé ---
const BookingRequestDetails = ({ request }: { request: TicketRequest }) => {
  const { tripInfo, carCompanyInfo, passengerName, seats, price } = request;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Hành khách:</span>
        <span className="font-semibold">{passengerName}</span>
      </div>
      <div className="flex justify-between">
        <span>Nhà xe:</span>
        <span className="font-semibold">{carCompanyInfo?.name}</span>
      </div>
      <div className="flex justify-between">
        <span>Ngày đi:</span>
        <span className="font-semibold">
          {tripInfo.startTime
            ? format(new Date(tripInfo.startTime), "HH:mm, dd/MM/yyyy")
            : "N/A"}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Ghế:</span>
        <span className="font-bold text-primary">
          {seats?.map((s) => s.code).join(", ")}
        </span>
      </div>
      <div className="flex justify-between items-baseline">
        <span>Tổng tiền:</span>
        <span className="font-bold text-lg text-secondary">
          {price.toLocaleString("vi-VN")}đ
        </span>
      </div>
    </div>
  );
};

const RefundRequestDetails = ({ request }: { request: TicketRequest }) => {
  const { amount, reason, createdAt } = request;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between items-baseline">
        <span>Số tiền yêu cầu:</span>
        <span className="font-bold text-lg text-secondary">
          {amount.toLocaleString("vi-VN")}đ
        </span>
      </div>
      <div className="flex justify-between">
        <span>Ngày yêu cầu:</span>
        <span className="font-semibold">
          {format(new Date(createdAt), "dd/MM/yyyy")}
        </span>
      </div>
      <div className="flex flex-col text-left mt-2">
        <span className="text-default-500">Lý do:</span>
        <p className="font-semibold text-foreground-700 pl-2 border-l-2 border-primary-200 mt-1">
          {reason}
        </p>
      </div>
    </div>
  );
};

export const RequestCard = ({
  request,
  onCancel,
  onViewDetails,
}: RequestCardProps) => {
  const { _id, status, titleRequest } = request;
  const statusInfo = statusMap[status] || {
    label: "Không xác định",
    color: "default",
  };

  const titleIcon =
    titleRequest === "Refund Ticket" ? (
      <DollarSign className="text-primary" size={20} />
    ) : (
      <Ticket className="text-primary" size={20} />
    );

  return (
    <Card className="p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex justify-between items-start pb-2">
        <div className="flex items-center gap-3">
          {titleIcon}
          <div className="flex flex-col">
            <p className="font-bold text-lg text-foreground">{titleRequest}</p>
            {request.tripInfo?.location && (
              <p className="text-sm text-default-500">
                {request.tripInfo.location}
              </p>
            )}
          </div>
        </div>
        <Chip color={statusInfo.color} size="sm" variant="flat">
          {statusInfo.label}
        </Chip>
      </CardHeader>

      <CardBody className="py-2">
        {/* --- CONDITIONAL RENDERING DỰA TRÊN titleRequest --- */}
        {titleRequest === "Refund Ticket" ? (
          <RefundRequestDetails request={request} />
        ) : (
          <BookingRequestDetails request={request} />
        )}
      </CardBody>

      <CardFooter className="pt-4 flex gap-2">
        <Button
          fullWidth
          size="sm"
          variant="bordered"
          onPress={() => onViewDetails(request)}
          startContent={<Info size={16} />}
        >
          Chi tiết
        </Button>
        {status === "Pending" && (
          <Button
            fullWidth
            color="danger"
            size="sm"
            onPress={() => onCancel(_id)}
          >
            Hủy yêu cầu
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
