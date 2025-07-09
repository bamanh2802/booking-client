// src/components/requests/RequestManagementPage.tsx

"use client";
import { useState, useEffect, useCallback } from "react";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";

import { RequestDetailsModal } from "./RequestDetailsModal"; // Đã import
import { RequestTable } from "./RequestTable";

import { getAllRequests } from "@/services/requests";
import { TicketRequest, TicketRequestStatus } from "@/types";

const STATUS_OPTIONS: { key: TicketRequestStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "Pending", label: "Chờ xử lý" },
  { key: "Confirmed", label: "Đã xác nhận" },
  { key: "Rejected", label: "Đã từ chối" },
  { key: "Cancelled", label: "Đã hủy" },
];

export default function RequestManagementPage() {
  const [requests, setRequests] = useState<TicketRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  // Thay đổi status filter để có kiểu tường minh
  const [statusFilter, setStatusFilter] = useState<TicketRequestStatus | "all">("all");

  const [selectedRequest, setSelectedRequest] = useState<TicketRequest | null>(null);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      // Xây dựng params một cách linh hoạt
      const params: { page: number; status?: TicketRequestStatus } = {
        page: pagination.page,
      };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      
      const response = await getAllRequests(params);

      if (response?.success && response.data) {
        setRequests(response.data.results);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
        }));
      } else {
        addToast({
            title: "Thông báo",
            description: response.message || "Không tìm thấy dữ liệu.",
            color: "warning",
        });
        setRequests([]);
        setPagination({ page: 1, totalPages: 1 });
      }
    } catch (err: any) {
      addToast({
        title: "Lỗi",
        description: err.message || "Không thể tải danh sách yêu cầu.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handlePageChange = (page: number) =>
    setPagination((prev) => ({ ...prev, page }));

  const handleFilterChange = (keys: any) => {
    // Lấy giá trị đầu tiên từ Set
    const status = Array.from(keys)[0] as TicketRequestStatus | "all";
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset về trang 1 khi filter
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Quản lý Yêu cầu</h1>
        <div className="w-full md:max-w-xs">
          <Select
            label="Lọc theo trạng thái"
            selectedKeys={new Set([statusFilter])}
            onSelectionChange={handleFilterChange}
          >
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner label="Đang tải danh sách yêu cầu..." />
        </div>
      ) : (
        <RequestTable
          requests={requests}
          onViewDetails={(request) => setSelectedRequest(request)}
        />
      )}

      {pagination.totalPages > 1 && !isLoading && (
        <div className="flex justify-center mt-8">
          <Pagination
            page={pagination.page}
            total={pagination.totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}

      {/* Modal sẽ chỉ hiển thị khi có selectedRequest */}
      <RequestDetailsModal
        isOpen={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        // onUpdateRequest={handleUpdateRequest} // Truyền hàm xử lý nếu cần
      />
    </div>
  );
}