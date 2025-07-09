// src/components/requests/RequestDetailsModal.tsx

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { format } from "date-fns";
import { TicketRequest } from "@/types";
import { RequestStatusChip } from "./RequestStatusChip";

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: TicketRequest | null;
  // Thêm các hàm xử lý hành động nếu cần
  // onUpdateRequest: (id: string, status: "Confirmed" | "Rejected") => void;
}

// Helper component để hiển thị một cặp thông tin
const InfoRow = ({ label, value }: { label: string; value?: React.ReactNode }) => {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-2 py-1">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="col-span-2 text-sm text-gray-900 dark:text-gray-200">{value}</dd>
    </div>
  );
};

export const RequestDetailsModal = ({
  isOpen,
  onClose,
  request,
}: RequestDetailsModalProps) => {
  if (!request) return null;

  const renderContent = () => {
    // Render nội dung dựa trên loại yêu cầu
    if (request.titleRequest === "Book Ticket") {
      return (
        <>
          <h3 className="font-semibold text-lg mb-2">Thông tin Chuyến đi</h3>
          <dl>
            <InfoRow label="Hành trình" value={request.tripInfo?.location} />
            <InfoRow label="Bến xe" value={request.tripInfo?.station} />
            <InfoRow label="Khởi hành" value={request.tripInfo?.startTime && format(new Date(request.tripInfo.startTime), "HH:mm dd/MM/yyyy")} />
            <InfoRow label="Nhà xe" value={request.carCompanyInfo?.name} />
            <InfoRow label="Hotline nhà xe" value={request.carCompanyInfo?.hotline} />
          </dl>
          <Divider className="my-4" />
          <h3 className="font-semibold text-lg mb-2">Chi tiết Vé</h3>
          <dl>
            <InfoRow label="Hành khách" value={request.passengerName} />
            <InfoRow label="SĐT Hành khách" value={request.passengerPhone} />
            <InfoRow label="Ghế đã chọn" value={request.seats?.map(s => s.code).join(", ")} />
            <InfoRow label="Tổng tiền" value={<span className="font-bold text-danger">{request.price?.toLocaleString("vi-VN")}đ</span>} />
          </dl>
        </>
      );
    }

    if (request.titleRequest === "Refund Ticket") {
      return (
        <>
          <h3 className="font-semibold text-lg mb-2">Thông tin Hoàn tiền</h3>
          <dl>
            <InfoRow label="Số tiền yêu cầu" value={<span className="font-bold text-danger">{request.amount?.toLocaleString("vi-VN")}đ</span>}/>
            <InfoRow label="Lý do" value={request.reason} />
            <InfoRow label="Mã vé (nếu có)" value={request.ticketId} />
          </dl>
        </>
      );
    }
    
    // Fallback cho các loại request khác
    return <p>Không có thông tin chi tiết cho loại yêu cầu này.</p>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Chi tiết Yêu cầu
              <span className="text-xs font-normal text-gray-500">ID: {request._id}</span>
            </ModalHeader>
            <ModalBody>
              <div className="mb-4">
                 <h3 className="font-semibold text-lg mb-2">Thông tin chung</h3>
                 <dl>
                    <InfoRow label="Loại yêu cầu" value={<span className="font-semibold">{request.titleRequest}</span>} />
                    <InfoRow label="Trạng thái" value={<RequestStatusChip status={request.status} />} />
                    {request.creatorInfo ? (
                        <InfoRow label="Người tạo" value={`${request.creatorInfo.fullName} (${request.creatorRole?.roleName || 'N/A'})`} />
                    ) : (
                        <InfoRow label="Người tạo" value="Khách hàng tự đặt" />
                    )}
                    <InfoRow label="Ngày tạo" value={format(new Date(request.createdAt), "HH:mm dd/MM/yyyy")} />
                 </dl>
              </div>
              <Divider className="my-4" />
              {renderContent()}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={close}>
                Đóng
              </Button>
              {/* Thêm các nút hành động ở đây nếu cần */}
              {/* Ví dụ:
              {request.status === 'Pending' && (
                <>
                  <Button color="danger" onPress={() => onUpdateRequest(request._id, 'Rejected')}>Từ chối</Button>
                  <Button color="primary" onPress={() => onUpdateRequest(request._id, 'Confirmed')}>Xác nhận</Button>
                </>
              )} 
              */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};