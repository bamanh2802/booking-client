// src/components/requests/RequestManagementPage.tsx

"use client";
import { useState, useEffect, useCallback } from "react";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";

import { RequestDetailsModal } from "./RequestDetailsModal"; // <-- Import modal mới
import { RequestTable } from "./RequestTable";

import { getAllRequests } from "@/services/requests";
import { TicketRequest, TicketRequestStatus } from "@/types";

// ... (STATUS_OPTIONS giữ nguyên)
const STATUS_OPTIONS: { key: TicketRequestStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "Pending", label: "Chờ xử lý" },
  { key: "Confirmed", label: "Đã xác nhận" },
  { key: "Rejected", label: "Đã từ chối" },
  { key: "Cancelled", label: "Đã hủy" },
];

export default function RequestManagementPage() {
  // ... (các state cũ giữ nguyên)
  const [requests, setRequests] = useState<TicketRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState<{ status: string }>({ status: "all" });
  const [requestToUpdate, setRequestToUpdate] = useState<{
    id: string;
    newStatus: "Confirmed" | "Rejected";
  } | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<TicketRequest | null>(
    null,
  );

  const fetchRequests = useCallback(async () => {
    // ... (logic fetch giữ nguyên)
    setIsLoading(true);
    try {
      const params = { page: pagination.page };
      const response = await getAllRequests(params);

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
    } catch (err) {
      addToast({
        title: "Lỗi",
        description: "Không thể tải danh sách yêu cầu.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, filters]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // --- CÁC HÀM HANDLER GIỮ NGUYÊN ---
  const handlePageChange = (page: number) =>
    setPagination((prev) => ({ ...prev, page }));
  const handleFilterChange = (keys: any) => {
    const status = Array.from(keys)[0] as string;

    setFilters({ status });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  const promptUpdateRequest = (
    id: string,
    newStatus: "Confirmed" | "Rejected",
  ) => {
    setRequestToUpdate({ id, newStatus });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header giữ nguyên */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Quản lý Yêu cầu Đặt vé</h1>
        <div className="w-full md:max-w-xs">
          <Select
            label="Lọc theo trạng thái"
            selectedKeys={new Set([filters.status])}
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
          <Spinner label="Đang tải..." />
        </div>
      ) : (
        <RequestTable
          requests={requests}
          onUpdateRequest={promptUpdateRequest}
          onViewDetails={(request) => setSelectedRequest(request)} // <-- TRUYỀN HÀM XỬ LÝ MỚI
        />
      )}

      {/* Pagination giữ nguyên */}
      {pagination.totalPages > 1 && !isLoading && (
        <div className="flex justify-center mt-8">
          <Pagination
            page={pagination.page}
            total={pagination.totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}

      <RequestDetailsModal
        isOpen={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
}
