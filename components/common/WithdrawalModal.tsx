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
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useAppDispatch, useAppSelector } from "@/lib/hook";

// FIXED: Import chính xác selector và type từ authSlice của bạn
import { selectCurrentUser, UserData } from "@/store/slices/authSlice";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// --- Sub-components cho các Tab ---

// Tab Lịch sử rút tiền (Không đổi)
const WithdrawalHistoryTab = () => {
  // ... code giữ nguyên ...
  const history = [
    { id: 1, amount: 500000, status: "Hoàn thành", date: "2023-10-26" },
    { id: 2, amount: 200000, status: "Đang xử lý", date: "2023-10-28" },
    { id: 3, amount: 1000000, status: "Đã hủy", date: "2023-10-29" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return "text-success";
      case "Đang xử lý":
        return "text-warning";
      case "Đã hủy":
        return "text-danger";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
      {history.length > 0 ? (
        history.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-3 bg-default-100 rounded-lg"
          >
            <div>
              <p className="font-semibold">{formatCurrency(item.amount)}</p>
              <p className="text-sm text-default-500">{item.date}</p>
            </div>
            <p className={`font-medium ${getStatusColor(item.status)}`}>
              {item.status}
            </p>
          </div>
        ))
      ) : (
        <p className="text-center text-default-500">
          Chưa có lịch sử rút tiền.
        </p>
      )}
    </div>
  );
};

// Tab Tạo yêu cầu rút tiền
const CreateRequestTab = ({
  user,
  onClose,
}: {
  // FIXED: Sử dụng type 'UserData' đã import
  user: UserData;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleCreateRequest = () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ.");
      return;
    }
    if (numericAmount > user.amount) {
      setError("Số tiền rút không được lớn hơn số dư hiện tại.");
      return;
    }

    console.log("Creating withdrawal request for:", numericAmount);
    onClose();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
        <p className="text-sm text-primary-700">Số dư khả dụng của bạn:</p>
        <p className="text-xl font-bold text-primary-800">
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
          setError("");
        }}
        isInvalid={!!error}
        errorMessage={error}
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">VND</span>
          </div>
        }
      />
      <Button color="primary" onPress={handleCreateRequest}>
        Tạo yêu cầu
      </Button>
    </div>
  );
};

// --- Component Modal Chính ---

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawalModal = ({ isOpen, onClose }: WithdrawalModalProps) => {
  // CORRECT: Gọi hook để lấy user từ store
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
              Quản lý số dư
            </ModalHeader>
            <ModalBody>
              <Tabs aria-label="Tùy chọn quản lý số dư">
                <Tab key="history" title="Lịch sử rút tiền">
                  <WithdrawalHistoryTab />
                </Tab>
                <Tab key="create" title="Tạo yêu cầu rút tiền">
                  <CreateRequestTab user={user} onClose={onCloseHandler} />
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onCloseHandler}>
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
