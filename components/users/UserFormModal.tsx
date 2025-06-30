// src/components/agent/users/UserFormModal.tsx

"use client";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";

import { ClientUser } from "@/types";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  userToEdit: ClientUser | null;
  isLoading: boolean;
  agentRole: "Agent1" | "Agent2" | string;
}

export const UserFormModal = ({
  isOpen,
  onClose,
  onSave,
  userToEdit,
  isLoading,
  agentRole,
}: UserFormModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    roleName: "Client",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // FIX #1: Sửa lỗi logic so sánh tên vai trò
  const isAgent1 = agentRole === "AgentLv1";

  const availableRoles = [
    { key: "Client", label: "Người dùng (Client)" },
    // FIX #2: Sửa lỗi logic key của vai trò
    ...(isAgent1 ? [{ key: "AgentLv2", label: "Đại lý cấp 2 (Agent2)" }] : []),
  ];

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setFormData({
          fullName: userToEdit.fullName,
          phone: userToEdit.phone,
          email: userToEdit.email || "",
          password: "",
          roleName: userToEdit.roleName,
        });
      } else {
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          password: "",
          roleName: "Client",
        });
      }
      setErrors({});
    }
  }, [userToEdit, isOpen]); // Xóa isAgent1 khỏi dependency array vì nó không thay đổi trong lúc modal mở

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Họ và tên là bắt buộc.";
    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại là bắt buộc.";
    if (!formData.email.trim()) newErrors.email = "Email là bắt buộc.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ.";

    if (!userToEdit && !formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc khi tạo mới.";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const dataToSave = { ...formData };

    if (userToEdit && !dataToSave.password) {
      delete (dataToSave as any).password;
    }
    onSave(dataToSave);
  };

  return (
    // FIX #3: Giải pháp triệt để cho lỗi tương tác UI
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="lg"
      onClose={onClose}
    >
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="font-bold">
              {userToEdit ? "Cập nhật người dùng" : "Thêm người dùng mới"}
            </ModalHeader>
            <ModalBody className="space-y-4 py-4">
              <Input
                isRequired
                errorMessage={errors.fullName}
                isInvalid={!!errors.fullName}
                label="Họ và Tên"
                value={formData.fullName}
                onValueChange={(v) => handleChange("fullName", v)}
              />
              <Input
                isRequired
                errorMessage={errors.phone}
                isInvalid={!!errors.phone}
                label="Số điện thoại"
                value={formData.phone}
                onValueChange={(v) => handleChange("phone", v)}
              />
              <Input
                isRequired
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                label="Email"
                type="email"
                value={formData.email}
                onValueChange={(v) => handleChange("email", v)}
              />

              {!userToEdit && isAgent1 && (
                <Select
                  label="Vai trò"
                  selectedKeys={new Set([formData.roleName])}
                  onSelectionChange={(keys) =>
                    handleChange("roleName", Array.from(keys)[0] as string)
                  }
                >
                  {availableRoles.map((role) => (
                    <SelectItem key={role.key}>{role.label}</SelectItem>
                  ))}
                </Select>
              )}

              <Input
                errorMessage={errors.password}
                isInvalid={!!errors.password}
                isRequired={!userToEdit}
                label="Mật khẩu"
                placeholder={
                  userToEdit ? "Bỏ trống nếu không đổi" : "Nhập mật khẩu"
                }
                type="password"
                onValueChange={(v) => handleChange("password", v)}
              />
            </ModalBody>
            <ModalFooter>
              <Button disabled={isLoading} variant="light" onPress={close}>
                Hủy
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                onPress={handleSubmit}
              >
                Lưu
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
