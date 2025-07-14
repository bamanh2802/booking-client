"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { refundRequest } from "@/services/requests";
import { UserData } from "@/store/slices/authSlice";
import { BankAccountData } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface CreateRequestFormProps {
  user: UserData;
  bankAccount: BankAccountData;
  onClose: () => void;
}

export const CreateRequestForm = ({
  user,
  bankAccount,
  onClose,
}: CreateRequestFormProps) => {
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

  const handleCreateRequest = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const numericAmount = Number(amount);

    try {
      await refundRequest(user._id, numericAmount, reason);

      addToast({
        title: "Gửi yêu cầu thành công!",
        description: `Yêu cầu rút ${formatCurrency(
          numericAmount
        )} của bạn đang được xử lý.`,
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
      <div className="p-3 bg-default-100 dark:bg-default-50 rounded-lg border border-default-200 dark:border-default-400/30">
        <p className="text-sm font-medium text-default-700 dark:text-default-300">
          Tài khoản nhận tiền:
        </p>
        <p className="text-lg font-bold text-foreground">
          {bankAccount.accountHolderName}
        </p>
        <p className="text-sm text-default-600 dark:text-default-400">
          {bankAccount.bankName} - {bankAccount.accountNumber}
        </p>
      </div>

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
