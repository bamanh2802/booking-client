// src/components/agent/users/UserManagementPage.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { addToast } from "@heroui/toast";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import { Button } from "@heroui/button";
import { PlusIcon } from "@heroicons/react/24/outline";

import { UserTable } from "./UserTable";
import { UserFormModal } from "./UserFormModal";
import { DeleteUserConfirmModal } from "./DeleteUserConfirmModal";

import { useAppSelector } from "@/lib/hook";
import {
  getAgentUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/user";
import { ClientUser } from "@/types";
import { selectCurrentUser } from "@/store/slices/authSlice";

export default function UserManagementPage() {
  const user = useAppSelector(selectCurrentUser);

  const [users, setUsers] = useState<ClientUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ClientUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Hàm fetchUsers giữ nguyên ---
  const fetchUsers = useCallback(async () => {
    if (!user?._id) return;
    setIsLoading(true);
    try {
      const response = await getAgentUsers();

      setUsers(response.data.results);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.pagination.totalPages,
      }));
    } catch (err) {
      addToast({
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, pagination.page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsFormModalOpen(true);
  };
  const handleOpenEdit = (user: ClientUser) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  };
  const handleCloseForm = () => {
    setIsFormModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await updateUser(editingUser._id, formData);
        addToast({
          title: "Thành công",
          description: "Đã cập nhật thông tin người dùng.",
          color: "success",
        });
      } else {
        await createUser(
          formData.email,
          formData.password,
          formData.fullName,
          formData.phone,
          formData.roleName,
        );
        addToast({
          title: "Thành công",
          description: "Đã thêm người dùng mới.",
          color: "success",
        });
      }
      handleCloseForm();
      fetchUsers();
    } catch (err: any) {
      addToast({
        title: "Lỗi",
        description: err.response?.data?.message || "Thao tác thất bại.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    // ... (Giữ nguyên)
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete);
      addToast({
        title: "Thành công",
        description: "Đã xóa người dùng.",
        color: "success",
      });
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      addToast({
        title: "Lỗi",
        description: "Xóa người dùng thất bại.",
        color: "danger",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
        <Button
          color="primary"
          startContent={<PlusIcon className="h-5 w-5" />}
          onPress={handleOpenAdd}
        >
          Thêm người dùng
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <UserTable
          users={users}
          onDelete={(id) => setUserToDelete(id)}
          onEdit={handleOpenEdit}
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

      <UserFormModal
        agentRole={user?.roleName || ""} // <-- THÊM DÒNG NÀY
        isLoading={isSubmitting}
        isOpen={isFormModalOpen}
        userToEdit={editingUser}
        onClose={handleCloseForm}
        onSave={handleSaveUser}
      />

      <DeleteUserConfirmModal
        isLoading={isDeleting}
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
