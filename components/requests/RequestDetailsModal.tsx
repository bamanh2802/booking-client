// src/components/requests/RequestDetailsModal.tsx
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

import { RequestStatusChip } from "./RequestStatusChip";

import { TicketRequest } from "@/types";

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

interface RequestDetailsModalProps extends Omit<ModalProps, "children"> {
  request: TicketRequest | null;
}

export const RequestDetailsModal = ({
  request,
  ...props
}: RequestDetailsModalProps) => {
  if (!request) return null;

  return (
    <Modal scrollBehavior="inside" size="2xl" {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Chi tiết Yêu cầu
              <span className="text-sm font-normal text-gray-500">
                ID: #{request._id.slice(-8).toUpperCase()}
              </span>
            </ModalHeader>
            <ModalBody>
              {/* Phần 1: Thông tin hành khách & vé */}
              <h3 className="text-lg font-semibold text-primary mb-2">
                Thông tin Hành khách
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <DetailRow label="Tên hành khách">
                  {request.passengerName}
                </DetailRow>
                <DetailRow label="Số điện thoại">
                  {request.passengerPhone}
                </DetailRow>
                <DetailRow label="Ghế đã chọn">
                  <div className="flex gap-1 justify-end">
                    {request.seats.map((s) => (
                      <Chip key={s.code} size="sm">
                        {s.code}
                      </Chip>
                    ))}
                  </div>
                </DetailRow>
                <DetailRow label="Tổng tiền">
                  <span className="text-danger font-bold text-lg">
                    {request.price.toLocaleString("vi-VN")}đ
                  </span>
                </DetailRow>
                <DetailRow label="Trạng thái">
                  <RequestStatusChip status={request.status} />
                </DetailRow>
              </div>

              <Divider className="my-4" />

              {/* Phần 2: Thông tin chuyến đi & nhà xe */}
              <h3 className="text-lg font-semibold text-primary mb-2">
                Thông tin Chuyến đi
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <DetailRow label="Lộ trình">
                  {request.tripInfo?.location}
                </DetailRow>
                <DetailRow label="Hành trình">
                  {request.tripInfo?.station}
                </DetailRow>
                <DetailRow label="Thời gian khởi hành">
                  {format(
                    new Date(request.tripInfo?.startTime),
                    "HH:mm - dd/MM/yyyy",
                  )}
                </DetailRow>
                <DetailRow label="Thời gian đến (dự kiến)">
                  {format(
                    new Date(request.tripInfo?.endTime),
                    "HH:mm - dd/MM/yyyy",
                  )}
                </DetailRow>
                <DetailRow label="Nhà xe">
                  {request.carCompanyInfo?.name}
                </DetailRow>
                <DetailRow label="Hotline nhà xe">
                  {request.carCompanyInfo?.hotline}
                </DetailRow>
              </div>

              {/* Phần 3: Thông tin người tạo */}
              {request.creatorInfo && (
                <>
                  <Divider className="my-4" />
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Thông tin Người tạo
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <DetailRow label="Tên người tạo">
                      {request.creatorInfo.fullName}
                    </DetailRow>
                    <DetailRow label="Email">
                      {request.creatorInfo.email}
                    </DetailRow>
                    <DetailRow label="Vai trò">
                      <Chip color="secondary" size="sm">
                        {request.creatorRole?.roleName}
                      </Chip>
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
