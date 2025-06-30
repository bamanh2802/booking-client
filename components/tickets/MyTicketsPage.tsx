// src/app/my-tickets/page.tsx (hoặc đường dẫn tương ứng)

"use client";

import { useState, useEffect, useCallback } from "react";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";

import { TicketDetailsModal } from "./TicketDetailsModal";
import { CancelTicketModal } from "./CancelTicketModal";
import { TicketCard } from "./TicketCard";

import { cancelTicket } from "@/services/booking";
import { getMyTickets } from "@/services/tickets";
import { Ticket } from "@/types";
import { useAppSelector } from "@/lib/hook";
import { selectCurrentUser } from "@/store/slices/authSlice";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAppSelector(selectCurrentUser);

  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ status: "all" });

  const [ticketToCancel, setTicketToCancel] = useState<Ticket | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);

  const fetchTickets = useCallback(async () => {
    if (!user?._id) {
      setIsLoading(false);
      setTickets([]);

      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.page,
        limit: 9,
      };
      const response = await getMyTickets(user?._id, params);

      if (response?.success && response.data) {
        setTickets(response.data.results);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
        }));
      } else {
        throw new Error(response.message || "Lỗi không xác định từ server");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể tải danh sách vé.";

      setError(errorMessage);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, pagination.page, filters.status]); // Thêm filters.status vào dependencies

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (keys: any) => {
    const status = Array.from(keys)[0] as string;

    setPagination((prev) => ({ ...prev, page: 1 }));
    setFilters({ status });
  };

  const handleConfirmCancel = async () => {
    if (!ticketToCancel) return;
    setIsCancelling(true);
    try {
      await cancelTicket(
        ticketToCancel._id,
        "Cancel Ticket",
        ticketToCancel.seats,
      );
      addToast({
        title: "Thành công",
        description:
          "Đã yêu cầu hủy vé thành công. Yêu cầu của bạn đang được xử lý.",
        color: "success",
      });
      setTicketToCancel(null);
      fetchTickets(); // Tải lại danh sách để cập nhật trạng thái
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || "Không thể hủy vé.";

      addToast({
        title: "Thất bại",
        description: errorMessage,
        color: "danger",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleViewDetails = (ticket: Ticket) => {
    setViewingTicket(ticket);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner label="Đang tải vé của bạn..." />
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center p-8 bg-danger-50 text-danger rounded-lg">
          {error}
        </div>
      );
    }
    if (tickets.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          Bạn chưa có vé nào hoặc không có vé phù hợp với bộ lọc.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            onCancel={() => setTicketToCancel(ticket)}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vé Của Tôi</h1>
          <p className="text-default-600 mt-1">
            Quản lý tất cả các vé bạn đã đặt.
          </p>
        </div>
        <div className="w-full md:max-w-xs">
          <Select
            label="Lọc theo trạng thái"
            selectedKeys={new Set([filters.status])}
            onSelectionChange={handleFilterChange}
          >
            <SelectItem key="all">Tất cả</SelectItem>
            <SelectItem key="Upcoming">Sắp đi</SelectItem>
            <SelectItem key="Done">Đã hoàn thành</SelectItem>
            <SelectItem key="Cancelled">Đã hủy</SelectItem>
          </Select>
        </div>
      </div>

      {renderContent()}

      {pagination.totalPages > 1 && !isLoading && (
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
        isOpen={!!ticketToCancel}
        onClose={() => setTicketToCancel(null)}
        onConfirm={handleConfirmCancel}
      />
      <TicketDetailsModal
        isOpen={!!viewingTicket}
        ticket={viewingTicket}
        onClose={() => setViewingTicket(null)}
      />
    </div>
  );
}
