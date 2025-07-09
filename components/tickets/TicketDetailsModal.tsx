// src/components/tickets/TicketDetailsModal.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Card } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { Ticket } from "@/types";
// Giả sử bạn có service này
import { getTicketById } from "@/services/tickets"; 
import { addToast } from "@heroui/toast";

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string | null; // <-- THAY ĐỔI: Nhận ticketId thay vì cả object
}

// Giữ nguyên các component con
const statusMap = {
  Confirmed: { text: "Đã xác nhận", color: "success" as const },
  Done: { text: "Hoàn thành", color: "success" as const },
  Cancelled: { text: "Đã hủy", color: "danger" as const },
  // Thêm các trạng thái khác nếu cần
};

const DetailRow = ({ label, value }: { label: string; value?: React.ReactNode }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start">
      <p className="text-sm text-gray-500">{label}:</p>
      <p className="text-sm font-semibold text-right">{value}</p>
    </div>
  );
};

export const TicketDetailsModal = ({ isOpen, onClose, ticketId }: TicketDetailsModalProps) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Chỉ fetch khi modal được mở và có ticketId
    if (isOpen && ticketId) {
      const fetchTicketDetails = async () => {
        setIsLoading(true);
        setTicket(null); // Xóa dữ liệu cũ khi mở lại
        try {
          const response = await getTicketById(ticketId);
          if (response.success && response.data) {
            setTicket(response.data);
          } else {
            addToast({ title: "Lỗi", description: "Không tìm thấy chi tiết vé.", color: "danger" });
            onClose(); // Đóng modal nếu không tìm thấy vé
          }
        } catch (error) {
          addToast({ title: "Lỗi", description: "Không thể tải chi tiết vé.", color: "danger" });
          onClose();
        } finally {
          setIsLoading(false);
        }
      };
      fetchTicketDetails();
    }
  }, [isOpen, ticketId, onClose]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner label="Đang tải chi tiết..." />
        </div>
      );
    }
    
    // Nếu không loading và không có ticket, hiển thị lỗi
    if (!ticket) {
      return (
        <div className="text-center py-10">
          Không có dữ liệu để hiển thị.
        </div>
      );
    }

    const statusInfo = statusMap[ticket.status] || {
      text: ticket.status,
      color: "default" as const,
    };
    
    // Giao diện của bạn, giờ đây hoàn toàn an toàn để sử dụng
    return (
      <>
        <ModalHeader className="flex justify-between items-center">
          <span className="text-lg font-bold">
            Chi tiết vé #{ticket._id.slice(-6)}
          </span>
          <Chip color={statusInfo.color} variant="flat">
            {statusInfo.text}
          </Chip>
        </ModalHeader>
        <ModalBody className="space-y-4">
          {/* Card Thông tin chuyến đi */}
          <Card className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-bold text-md mb-2">Thông tin chuyến đi</h3>
            <div className="space-y-2">
              <DetailRow label="Tuyến đường" value={ticket.tripInfo?.station} />
              <DetailRow label="Ngày đi" value={ticket.tripInfo?.startTime && format(new Date(ticket.tripInfo.startTime), "EEEE, dd/MM/yyyy", { locale: vi })} />
              <DetailRow label="Giờ khởi hành" value={ticket.tripInfo?.startTime && format(new Date(ticket.tripInfo.startTime), "HH:mm")} />
              <DetailRow label="Giờ dự kiến đến" value={ticket.tripInfo?.endTime && format(new Date(ticket.tripInfo.endTime), "HH:mm")} />
              <DetailRow label="Thời gian di chuyển" value={ticket.tripInfo?.time} />
            </div>
          </Card>

          {/* Card Thông tin hành khách */}
          <Card className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-bold text-md mb-2">Thông tin hành khách</h3>
            <div className="space-y-2">
              <DetailRow label="Họ và tên" value={ticket.passengerName} />
              <DetailRow label="Số điện thoại" value={ticket.passengerPhone} />
              <DetailRow label="Ghế đã chọn" value={<span className="text-primary font-bold">{ticket.seats.map((s) => s.code).join(", ")}</span>} />
              <DetailRow label="Loại vé" value={ticket.type} />
            </div>
          </Card>

          {/* Grid Nhà xe và Thanh toán */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-bold text-md mb-2">Nhà xe</h3>
              <DetailRow label="Tên nhà xe" value={ticket.carCompanyInfo?.name} />
              <DetailRow label="Hotline" value={<a className="text-primary hover:underline" href={`tel:${ticket.carCompanyInfo?.hotline}`}>{ticket.carCompanyInfo?.hotline}</a>} />
            </Card>
            <Card className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-bold text-md mb-2">Thanh toán</h3>
              <DetailRow label="Tổng tiền" value={<span className="text-danger font-bold">{ticket.price.toLocaleString("vi-VN")}đ</span>} />
              <DetailRow label="Ngày đặt" value={format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")} />
            </Card>
          </div>
        </ModalBody>
      </>
    );
  };
  
  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalContent>
        {(close) => (
          <>
            {renderContent()}
            <ModalFooter>
              <Button color="primary" variant="light" onPress={close}>
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};