// src/components/requests/RequestTable.tsx

"use client";
import { useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

import { RequestStatusChip } from "./RequestStatusChip";

import { TicketRequest } from "@/types";

// --- THIẾT KẾ LẠI CÁC CỘT ---
const columns = [
  { key: "passenger", label: "Hành khách & Chuyến đi" },
  { key: "price", label: "Tổng tiền" },
  { key: "creator", label: "Người tạo" },
  { key: "status", label: "Trạng thái" },
  { key: "actions", label: " " },
];

interface RequestTableProps {
  requests: TicketRequest[];
  onUpdateRequest: (id: string, status: "Confirmed" | "Rejected") => void;
  onViewDetails: (request: TicketRequest) => void;
}

export const RequestTable = ({
  requests,
  onUpdateRequest,
  onViewDetails, // Nhận prop mới
}: RequestTableProps) => {
  const renderCell = useCallback(
    (request: TicketRequest, columnKey: React.Key) => {
      switch (columnKey) {
        case "passenger":
          return (
            <div>
              <p className="font-semibold">{request.passengerName}</p>
              <p className="text-sm text-primary">
                {request.tripInfo?.location}
              </p>
              <p className="text-xs text-gray-500">
                {format(
                  new Date(request.tripInfo?.startTime),
                  "HH:mm dd/MM/yyyy",
                )}
              </p>
            </div>
          );

        case "price":
          return (
            <span className="font-bold text-danger">
              {request.price.toLocaleString("vi-VN")}đ
            </span>
          );

        case "creator":
          return request.creatorInfo ? (
            <p className="text-sm">{request.creatorInfo.fullName}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">Khách tự đặt</p>
          );

        case "status":
          return <RequestStatusChip status={request.status} />;

        case "actions":
          return (
            <div className="relative flex justify-end items-center">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Request Actions">
                  {/* Sửa lại hành động này */}
                  <DropdownItem key={1} onPress={() => onViewDetails(request)}>
                    Xem chi tiết
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );

        default:
          return null;
      }
    },
    [onUpdateRequest, onViewDetails],
  );

  return (
    <Table aria-label="Bảng quản lý yêu cầu vé">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            className={column.key === "actions" ? "text-right" : ""}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"Không có yêu cầu nào."} items={requests}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
