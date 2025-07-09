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
import { Button } from "@heroui/button";
import { EyeIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

import { RequestStatusChip } from "./RequestStatusChip";
import { TicketRequest } from "@/types";

// Thiết kế lại các cột cho phù hợp
const columns = [
  { key: "requestInfo", label: "Thông tin Yêu cầu" },
  { key: "amount", label: "Số tiền / Giá vé" },
  { key: "creator", label: "Người tạo" },
  { key: "status", label: "Trạng thái" },
  { key: "actions", label: " " },
];

interface RequestTableProps {
  requests: TicketRequest[];
  onViewDetails: (request: TicketRequest) => void;
  // onUpdateRequest: (id: string, status: "Confirmed" | "Rejected") => void;
}

export const RequestTable = ({
  requests,
  onViewDetails,
}: RequestTableProps) => {
  const renderCell = useCallback(
    (request: TicketRequest, columnKey: React.Key) => {
      switch (columnKey) {
        case "requestInfo":
          return (
            <div>
              <p className="font-semibold">{request.titleRequest}</p>
              {request.titleRequest === "Book Ticket" ? (
                <p className="text-sm text-primary">
                  {request.passengerName} - {request.tripInfo?.location}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic truncate w-48">
                  {request.reason || "Yêu cầu hoàn tiền"}
                </p>
              )}
               <p className="text-xs text-gray-500">
                  {format(new Date(request.createdAt), "dd/MM/yyyy HH:mm")}
                </p>
            </div>
          );

        case "amount":
            const value = request.price ?? request.amount;
            return (
              <span className="font-bold text-danger">
                {value != null ? `${value.toLocaleString("vi-VN")}₫` : "N/A"}
              </span>
            );

        case "creator":
          return request.creatorInfo ? (
            <div>
                 <p className="text-sm font-medium">{request.creatorInfo.fullName}</p>
                 <p className="text-xs text-gray-500">{request.creatorRole?.roleName}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Khách tự đặt</p>
          );

        case "status":
          return <RequestStatusChip status={request.status} />;

        case "actions":
          return (
            <div className="relative flex justify-end items-center">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                onPress={() => onViewDetails(request)}
                aria-label="Xem chi tiết"
              >
                <EyeIcon className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          );

        default:
          return null;
      }
    },
    [onViewDetails]
  );

  return (
    <Table aria-label="Bảng quản lý yêu cầu">
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