// src/components/tickets/TicketTable.tsx
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
import {
  EllipsisHorizontalIcon,
  TicketIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

import { TicketStatusChip } from "../requests/TicketStatusChip";

import { Ticket } from "@/types";

const columns = [
  { key: "passenger", label: "Hành khách & Chuyến đi" },
  { key: "creator", label: "Người tạo" },
  { key: "status", label: "Trạng thái" },
  { key: "actions", label: " " },
];

interface TicketTableProps {
  tickets: Ticket[];
  onCancelTicket: (ticket: Ticket) => void;
  onViewDetails: (ticket: Ticket) => void;
}

export const TicketTable = ({
  tickets,
  onCancelTicket,
  onViewDetails,
}: TicketTableProps) => {
  const renderCell = useCallback(
    (ticket: Ticket, columnKey: React.Key) => {
      switch (columnKey) {
        case "passenger":
          return (
            <div>
              <p className="font-semibold">{ticket.passengerName}</p>
              <p className="text-sm text-primary">
                {ticket.tripInfo?.location}
              </p>
              {/* SỬA LỖI TẠI ĐÂY */}
              {ticket.tripInfo?.startTime ? (
                <p className="text-xs text-gray-500">
                  {format(
                    new Date(ticket.tripInfo.startTime),
                    "HH:mm dd/MM/yyyy"
                  )}
                </p>
              ) : null}
            </div>
          );

        case "creator":
          return ticket.creatorInfo ? (
            <p className="text-sm">{ticket.creatorInfo.fullName}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">Khách tự đặt</p>
          );

        case "status":
          return <TicketStatusChip status={ticket.status} />;

        case "actions":
          // Logic phân quyền: Chỉ hiển thị nút Hủy khi creatorInfo là null
          // và vé chưa bị hủy hoặc hoàn thành.
          const canCancel =
            !ticket.creatorInfo &&
            (ticket.status === "Upcoming" || ticket.status === "Confirmed");

          return (
            <div className="relative flex justify-end items-center">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Ticket Actions">
                  <DropdownItem
                    key={1}
                    startContent={<TicketIcon className="h-4 w-4" />}
                    onPress={() => onViewDetails(ticket)}
                  >
                    Xem chi tiết
                  </DropdownItem>

                  {canCancel && (
                    <DropdownItem
                      key={2}
                      className="text-danger"
                      color="danger"
                      startContent={<XCircleIcon className="h-4 w-4" />}
                      onPress={() => onCancelTicket(ticket)}
                    >
                      Hủy vé
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          );

        default:
          return null;
      }
    },
    [onCancelTicket, onViewDetails]
  );

  return (
    <Table aria-label="Bảng quản lý vé">
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
      <TableBody emptyContent={"Không tìm thấy vé nào."} items={tickets}>
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
