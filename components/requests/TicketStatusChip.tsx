// src/components/tickets/TicketStatusChip.tsx
"use client";

import { Chip, ChipProps } from "@heroui/chip";
import { CheckCircle, Clock, XCircle, Ban } from "lucide-react";

import { TicketStatus } from "@/types";

const statusConfig: Record<
  string,
  {
    label: string;
    color: ChipProps["color"];
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  Upcoming: {
    label: "Sắp đi",
    color: "primary",
    icon: Clock,
  },
  Confirmed: {
    label: "Đã xác nhận",
    color: "primary",
    icon: Clock,
  },
  Done: {
    label: "Hoàn thành",
    color: "success",
    icon: CheckCircle,
  },
  Cancelled: {
    label: "Đã hủy",
    color: "danger",
    icon: XCircle,
  },
  Default: {
    label: "Không xác định",
    color: "default",
    icon: Ban,
  },
};

interface TicketStatusChipProps {
  status: TicketStatus;
}

export const TicketStatusChip = ({ status }: TicketStatusChipProps) => {
  const config = statusConfig[status] || statusConfig.Default;
  const Icon = config.icon;

  return (
    <Chip
      color={config.color}
      size="sm"
      startContent={<Icon className="h-4 w-4" />}
      variant="flat"
    >
      {config.label}
    </Chip>
  );
};
