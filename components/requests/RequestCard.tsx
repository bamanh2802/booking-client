// src/components/request/RequestCard.tsx

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { format } from "date-fns";

import { TicketRequest } from "@/types";

interface RequestCardProps {
  request: TicketRequest;
  onCancel: (requestId: string) => void;
  onViewDetails: (request: TicketRequest) => void;
}

const statusMap = {
  Pending: { label: "Chờ xác nhận", color: "warning" as const },
  Confirmed: { label: "Đã xác nhận", color: "success" as const },
  Cancelled: { label: "Đã hủy", color: "danger" as const },
};

export const RequestCard = ({
  request,
  onCancel,
  onViewDetails,
}: RequestCardProps) => {
  const {
    status,
    tripInfo,
    carCompanyInfo,
    passengerName,
    seats,
    price,
    titleRequest,
  } = request;

  const statusInfo = statusMap[status];

  return (
    <Card className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardHeader className="flex justify-between items-start pb-2">
        <div className="flex flex-col">
          <p className="font-bold text-lg">{tripInfo.location}</p>
          <p className="text-sm text-default-500">{carCompanyInfo?.name}</p>
        </div>
        <Chip color={statusInfo.color} size="sm" variant="flat">
          {statusInfo.label}
        </Chip>
      </CardHeader>
      <CardBody className="py-2 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Hành khách:</span>
          <span className="font-semibold">{passengerName}</span>
        </div>

        {/* 2. Thêm dòng hiển thị `titleRequest` */}
        <div className="flex justify-between">
          <span>Loại yêu cầu:</span>
          <span className="font-semibold">{titleRequest}</span>
        </div>

        <div className="flex justify-between">
          <span>Ngày đi:</span>
          <span className="font-semibold">
            {format(new Date(tripInfo.startTime), "HH:mm, dd/MM/yyyy")}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Ghế:</span>
          <span className="font-bold text-primary">
            {seats.map((s) => s.code).join(", ")}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tổng tiền:</span>
          <span className="font-bold text-lg text-secondary">
            {price.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </CardBody>
      <CardFooter className="pt-2 flex gap-2">
        <Button
          fullWidth
          size="sm"
          variant="bordered"
          onPress={() => onViewDetails(request)}
        >
          Xem chi tiết
        </Button>
        {status === "Pending" && (
          <Button
            fullWidth
            color="danger"
            size="sm"
            onPress={() => onCancel(request._id)}
          >
            Hủy yêu cầu
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
