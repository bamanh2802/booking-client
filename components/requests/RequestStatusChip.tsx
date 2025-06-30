"use client";
import { Chip } from "@heroui/chip";

import { TicketRequest } from "@/types";

const statusMap = {
  Pending: { text: "Chờ xử lý", color: "warning" as const },
  Approved: { text: "Đã duyệt", color: "success" as const },
  Rejected: { text: "Đã từ chối", color: "danger" as const },
  Cancelled: { text: "Đã hủy bởi người dùng", color: "default" as const },
};

export const RequestStatusChip = ({
  status,
}: {
  status: TicketRequest["status"];
}) => {
  const statusInfo = statusMap[status] || {
    text: status,
    color: "default" as const,
  };

  return (
    <Chip color={statusInfo.color} size="sm" variant="flat">
      {statusInfo.text}
    </Chip>
  );
};
