// src/pages/admin/tickets/page.tsx (hoặc đường dẫn tương ứng)
"use client";

import { useState, useEffect, useCallback } from "react";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { SearchIcon } from "lucide-react";

import { Ticket } from "@/types";
import { getAllTickets } from "@/services/tickets";
import { cancelTicket } from "@/services/booking";
import { TicketTable } from "@/components/tickets/TicketTable";
import { TicketDetailsModal } from "@/components/tickets/TicketDetailsModal";
import { CancelTicketConfirmModal } from "@/components/tickets/CancelTicketConfirmModal";

export default function TicketManagementPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [searchQuery, setSearchQuery] = useState("");

  // State quản lý modals
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketToCancel, setTicketToCancel] = useState<Ticket | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      // Giả sử API có hỗ trợ tìm kiếm theo `query`
      const params = { page: pagination.page, query: searchQuery || undefined };
      const response = await getAllTickets(params);

      if (response?.success && response.data) {
        setTickets(response.data.results);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
        }));
      } else {
        setTickets([]);
        setPagination({ page: 1, totalPages: 1 });
      }
    } catch (_) {
      addToast({
        title: "Lỗi",
        description: "Không thể tải danh sách vé.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTickets();
    }, 500); // Debounce để không gọi API mỗi khi gõ phím

    return () => clearTimeout(handler);
  }, [fetchTickets]);

  const handleConfirmCancel = async () => {
    if (!ticketToCancel) return;
    setIsCancelling(true);
    try {
      await cancelTicket(
        ticketToCancel._id,
        "Cancel Ticket",
        ticketToCancel.seats
      );
      addToast({
        title: "Thành công",
        description: "Đã hủy vé.",
        color: "success",
      });
      setTicketToCancel(null);
      fetchTickets();
    } catch (err: any) {
      addToast({
        title: "Lỗi",
        description: err.response?.data?.message || "Hủy vé thất bại.",
        color: "danger",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Quản lý Vé</h1>
        <div className="w-full md:w-auto md:max-w-sm">
          <Input
            label="Tìm kiếm vé"
            placeholder="Nhập tên, SĐT, mã vé..."
            startContent={<SearchIcon className="text-gray-400" />}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner label="Đang tải..." />
        </div>
      ) : (
        <TicketTable
          tickets={tickets}
          onCancelTicket={setTicketToCancel}
          onViewDetails={setSelectedTicket}
        />
      )}

      {pagination.totalPages > 1 && !isLoading && (
        <div className="flex justify-center mt-8">
          <Pagination
            page={pagination.page}
            total={pagination.totalPages}
            onChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
          />
        </div>
      )}

      {/* Modals */}
      <TicketDetailsModal
        isOpen={!!selectedTicket}
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
      <CancelTicketConfirmModal
        isLoading={isCancelling}
        isOpen={!!ticketToCancel}
        onClose={() => setTicketToCancel(null)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
