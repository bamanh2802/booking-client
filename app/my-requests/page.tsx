// src/app/my-requests/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";

import { TicketRequest } from "@/types";
import { getAllRequest, cancelRequest } from "@/services/booking";
import { RequestCard } from "@/components/requests/RequestCard";
import { CancelTicketModal } from "@/components/tickets/CancelTicketModal";
import { RequestDetailsModal } from "@/components/requests/RequestDetailsModal";
import { useAppSelector } from "@/lib/hook";
import { selectCurrentUser } from "@/store/slices/authSlice";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<TicketRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAppSelector(selectCurrentUser);

  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ status: "all" });

  const [requestToCancel, setRequestToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // FIX #3: Sử dụng type TicketRequest cho modal chi tiết
  const [viewingRequest, setViewingRequest] = useState<TicketRequest | null>(
    null,
  );

  const fetchRequests = useCallback(async () => {
    if (!user?._id) {
      setIsLoading(false);
      setRequests([]);

      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // FIX #4: TRUYỀN PARAMS ĐÚNG CHO HÀM API ĐÃ SỬA
      const params = {
        page: pagination.page,
        limit: 9,
      };
      const response = await getAllRequest(params);

      if (response?.success && response.data) {
        setRequests(response.data.results);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
        }));
      } else {
        setRequests([]);
        setPagination({ page: 1, totalPages: 1 });
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể tải danh sách yêu cầu.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id, pagination.page, filters.status]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (keys: any) => {
    const status = Array.from(keys)[0] as string;

    setPagination((prev) => ({ ...prev, page: 1 }));
    setFilters({ status });
  };

  const handleConfirmCancel = async () => {
    if (!requestToCancel) return;
    setIsCancelling(true);
    try {
      await cancelRequest(requestToCancel);
      addToast({
        title: "Thành công",
        description: "Đã hủy yêu cầu đặt vé thành công.",
        color: "success",
      });
      setRequestToCancel(null);
      fetchRequests();
    } catch (err: any) {
      addToast({
        title: "Thất bại",
        description:
          err.response?.data?.message || "Không thể hủy yêu cầu này.",
        color: "danger",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleViewDetails = (request: TicketRequest) => {
    setViewingRequest(request);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner label="Đang tải lịch sử..." size="lg" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center p-8 bg-danger-50 text-danger-600 rounded-lg">
          <p className="font-semibold">Đã xảy ra lỗi</p>
          <p>{error}</p>
        </div>
      );
    }
    if (requests.length === 0) {
      return (
        <div className="text-center p-8 bg-default-100 rounded-lg">
          <p className="font-semibold">Không có yêu cầu nào</p>
          <p className="text-sm text-default-500">
            Bạn chưa có yêu cầu đặt vé nào hoặc không có kết quả phù hợp với bộ
            lọc.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <RequestCard
            key={request._id}
            request={request}
            onCancel={setRequestToCancel}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* ... (phần JSX còn lại giữ nguyên) ... */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Lịch Sử Đặt Vé</h1>
        <p className="text-default-600 mt-1">
          Theo dõi và quản lý các yêu cầu đặt vé của bạn tại đây.
        </p>
      </div>

      <div className="mb-6 max-w-xs">
        <Select
          label="Lọc theo trạng thái"
          selectedKeys={new Set([filters.status])}
          onSelectionChange={handleFilterChange}
        >
          <SelectItem key="all">Tất cả</SelectItem>
          <SelectItem key="Confirmed">Đã xác nhận</SelectItem>
          <SelectItem key="Pending">Chờ xác nhận</SelectItem>
          <SelectItem key="Cancelled">Đã hủy</SelectItem>
        </Select>
      </div>

      {renderContent()}

      {pagination.totalPages > 1 && !isLoading && requests.length > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            page={pagination.page}
            total={pagination.totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}

      <CancelTicketModal
        isLoading={isCancelling}
        isOpen={!!requestToCancel}
        onClose={() => setRequestToCancel(null)}
        onConfirm={handleConfirmCancel}
      />

      {/* Modal này giờ sẽ nhận đúng type và không báo lỗi nữa */}
      <RequestDetailsModal
        isOpen={!!viewingRequest}
        request={viewingRequest}
        onClose={() => setViewingRequest(null)}
      />
    </div>
  );
}
