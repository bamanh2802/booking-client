// src/components/tickets/TicketDetailsModal.tsx
"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import { format } from "date-fns";
import React from "react";

import { TicketStatusChip } from "./TicketStatusChip";

import { Ticket } from "@/types";

const DetailRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex justify-between items-start py-2">
    <p className="text-sm text-gray-500">{label}</p>
    <div className="text-right font-medium text-gray-800">{children}</div>
  </div>
);

interface TicketDetailsModalProps extends Omit<ModalProps, "children"> {
  ticket: Ticket | null;
}

export const TicketDetailsModal = ({
  ticket,
  ...props
}: TicketDetailsModalProps) => {
  if (!ticket) return null;

  return (
    <Modal scrollBehavior="inside" size="2xl" {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Chi tiết Vé
              <span className="text-sm font-normal text-gray-500">
                ID: #{ticket._id.slice(-8).toUpperCase()}
              </span>
            </ModalHeader>
            <ModalBody>
              {/* Thông tin hành khách & vé */}
              <h3 className="text-lg font-semibold text-primary mb-2">
                Thông tin Vé
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <DetailRow label="Tên hành khách">
                  {ticket.passengerName}
                </DetailRow>
                <DetailRow label="Số điện thoại">
                  {ticket.passengerPhone}
                </DetailRow>
                <DetailRow label="Ghế đã chọn">
                  <div className="flex gap-1 justify-end">
                    {ticket.seats.map((s) => (
                      <Chip key={s.code} size="sm">
                        {s.code}
                      </Chip>
                    ))}
                  </div>
                </DetailRow>
                <DetailRow label="Trạng thái">
                  <TicketStatusChip status={ticket.status} />
                </DetailRow>
                <DetailRow label="Thanh toán hoa hồng">
                  <Chip
                    color={ticket.commissionPaid ? "success" : "warning"}
                    size="sm"
                  >
                    {ticket.commissionPaid ? "Đã trả" : "Chưa trả"}
                  </Chip>
                </DetailRow>
                <DetailRow label="Tổng tiền">
                  <span className="text-danger font-bold text-lg">
                    {ticket.price.toLocaleString("vi-VN")}đ
                  </span>
                </DetailRow>
              </div>

              <Divider className="my-4" />

              {/* Thông tin chuyến đi & nhà xe */}
              <h3 className="text-lg font-semibold text-primary mb-2">
                Thông tin Chuyến đi
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <DetailRow label="Lộ trình">
                  {ticket.tripInfo?.location}
                </DetailRow>
                <DetailRow label="Hành trình">
                  {ticket.tripInfo?.station}
                </DetailRow>
                <DetailRow label="Khởi hành">
                  {format(
                    new Date(ticket.tripInfo?.startTime),
                    "HH:mm - dd/MM/yyyy",
                  )}
                </DetailRow>
                <DetailRow label="Nhà xe">
                  {ticket.carCompanyInfo?.name}
                </DetailRow>
              </div>

              {/* Thông tin người tạo */}
              {ticket.creatorInfo && (
                <>
                  <Divider className="my-4" />
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Thông tin Người tạo
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <DetailRow label="Tên người tạo">
                      {ticket.creatorInfo.fullName}
                    </DetailRow>
                    <DetailRow label="Email">
                      {ticket.creatorInfo.email}
                    </DetailRow>
                  </div>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
