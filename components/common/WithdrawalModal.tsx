// src/components/modals/WithdrawalModal.tsx

"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input"; // Thêm Textarea
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { refundRequest } from "@/services/requests";
import { addToast } from "@heroui/toast"; // Import toast

// Import action và type từ slice
import {
  selectCurrentUser,
  updateUser,
  UserData,
} from "@/store/slices/authSlice";

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// --- Sub-component cho Form Tạo Yêu Cầu Rút Tiền ---
const CreateRequestTab = ({
  user,
  onClose,
}: {
  user: UserData;
  onClose: () => void;
}) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; reason?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { amount?: string; reason?: string } = {};
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      newErrors.amount = "Vui lòng nhập số tiền hợp lệ.";
    } else if (numericAmount > user.amount) {
      newErrors.amount = "Số tiền rút không được lớn hơn số dư hiện tại.";
    }

    if (!reason.trim()) {
      newErrors.reason = "Vui lòng nhập lý do rút tiền.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý gửi yêu cầu
  const handleCreateRequest = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const numericAmount = Number(amount);

    try {
      await refundRequest(user._id, numericAmount, reason);

      addToast({
        title: "Gửi yêu cầu thành công!",
        description: `Yêu cầu rút ${formatCurrency(numericAmount)} của bạn đang được xử lý.`,
        color: "success",
      });

      onClose();
    } catch (e) {
      console.error(e);
      addToast({
        title: "Gửi yêu cầu thất bại",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 bg-primary-50 dark:bg-primary-400/10 rounded-lg border border-primary-200 dark:border-primary-400/30">
        <p className="text-sm text-primary-700 dark:text-primary-300">
          Số dư khả dụng của bạn:
        </p>
        <p className="text-xl font-bold text-primary-800 dark:text-primary-200">
          {formatCurrency(user.amount)}
        </p>
      </div>

      <Input
        type="number"
        label="Số tiền muốn rút"
        placeholder="0"
        value={amount}
        onValueChange={(value) => {
          setAmount(value);
          if (errors.amount)
            setErrors((prev) => ({ ...prev, amount: undefined }));
        }}
        isInvalid={!!errors.amount}
        errorMessage={errors.amount}
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">VND</span>
          </div>
        }
      />

      <Textarea
        label="Lý do rút tiền"
        placeholder="Ví dụ: Rút tiền về tài khoản cá nhân..."
        value={reason}
        onValueChange={(value) => {
          setReason(value);
          if (errors.reason)
            setErrors((prev) => ({ ...prev, reason: undefined }));
        }}
        isInvalid={!!errors.reason}
        errorMessage={errors.reason}
        isRequired
      />

      <Button
        color="primary"
        onPress={handleCreateRequest}
        isLoading={isLoading}
      >
        Gửi yêu cầu
      </Button>
    </div>
  );
};
interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawalModal = ({ isOpen, onClose }: WithdrawalModalProps) => {
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="xl">
      <ModalContent>
        {(onCloseHandler) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Tạo Yêu Cầu Rút Tiền
            </ModalHeader>
            <ModalBody>
              <CreateRequestTab user={user} onClose={onCloseHandler} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onCloseHandler}>
                Hủy
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
