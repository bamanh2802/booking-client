// src/components/agent/users/UserTable.tsx

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
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip"; // Import Chip component
import { format } from "date-fns";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

import { ClientUser } from "@/types";

interface UserTableProps {
  users: ClientUser[];
  onEdit: (user: ClientUser) => void;
  onDelete: (userId: string) => void;
}

// Cập nhật danh sách các cột
const columns = [
  { key: "user", label: "Người dùng" },
  { key: "contact", label: "Liên hệ" },
  { key: "amount", label: "Số dư" }, // Thêm cột số dư
  { key: "createdAt", label: "Ngày tham gia" },
  { key: "actions", label: "Hành động" },
];

export const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
  const renderCell = useCallback(
    (user: ClientUser, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof ClientUser];

      switch (columnKey) {
        case "user":
          return (
            <div className="flex ">
              <span className="font-semibold text-gray-800">
                {user.fullName}
              </span>
              <Chip
                className="mt-1 w-fit" // w-fit để chip vừa với nội dung
                color={user.roleName === "Agent2" ? "primary" : "default"}
                size="sm"
                variant="flat"
              >
                {user.roleName}
              </Chip>
            </div>
          );

        case "contact":
          return (
            <div>
              <p className="text-sm">{user.phone}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          );

        // Thêm case để render cột 'amount'
        case "amount":
          return (
            <span className="font-semibold text-green-600">
              {(user.amount || 0).toLocaleString("vi-VN")}đ
            </span>
          );

        case "createdAt":
          return format(new Date(user.createdAt), "dd/MM/yyyy");

        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="Sửa người dùng">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => onEdit(user)}
                >
                  <PencilIcon className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
                </Button>
              </Tooltip>

              <Tooltip color="danger" content="Xóa người dùng">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => onDelete(user._id)}
                >
                  <TrashIcon className="h-5 w-5 text-gray-600 hover:text-danger transition-colors" />
                </Button>
              </Tooltip>
            </div>
          );

        default:
          return String(cellValue);
      }
    },
    [onEdit, onDelete],
  );

  return (
    <Table aria-label="Bảng quản lý người dùng">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            className={column.key === "actions" ? "text-center" : ""}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent="Chưa có người dùng nào." items={users}>
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
