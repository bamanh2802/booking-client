/**
 * @file Component hiển thị form cho phép người dùng nhập tay thông tin tài khoản ngân hàng.
 */
"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { createBankAccount } from "@/services/bank";
import { UserData } from "@/store/slices/authSlice";
import { BankAccountData } from "@/types";

// --- PROPS & INTERFACES ---
interface AddBankAccountFormProps {
  user: UserData;
  onAccountAdded: (newAccount: BankAccountData) => void;
}

interface BankInfo {
  name: string;
  shortName: string;
}

interface ValidationErrors {
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
}

// --- COMPONENT ---
export const AddBankAccountForm = ({
  user,
  onAccountAdded,
}: AddBankAccountFormProps) => {
  // --- STATE ---
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // --- DATA ---
  // Danh sách ngân hàng, có thể tách ra file constants nếu muốn
  const supportedBanks: BankInfo[] = [
    { name: "Ngân hàng TMCP Ngoại thương Việt Nam", shortName: "Vietcombank" },
    { name: "Ngân hàng TMCP Kỹ thương Việt Nam", shortName: "Techcombank" },
    { name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", shortName: "BIDV" },
    { name: "Ngân hàng TMCP Quân đội", shortName: "MB Bank" },
    { name: "Ngân hàng TMCP Á Châu", shortName: "ACB" },
    { name: "Ngân hàng TMCP Công thương Việt Nam", shortName: "VietinBank" },
    { name: "Ngân hàng TMCP Sài Gòn Thương Tín", shortName: "Sacombank" },
    { name: "Ngân hàng TMCP Việt Nam Thịnh Vượng", shortName: "VPBank" },
    { name: "Ngân hàng TMCP Tiên Phong", shortName: "TPBank" },
    { name: "Ngân hàng TMCP Phương Đông", shortName: "OCB" },
    // Thêm các ngân hàng khác nếu cần
  ];

  // --- VALIDATION ---
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const cleanedAccountNumber = accountNumber.replace(/\s/g, "");

    // Validate Tên chủ tài khoản
    if (!accountHolderName.trim() || accountHolderName.length < 2) {
      newErrors.accountHolderName = "Vui lòng nhập tên chủ tài khoản hợp lệ.";
    }

    // Validate Ngân hàng
    if (!bankName.trim()) {
      newErrors.bankName = "Vui lòng chọn ngân hàng.";
    }

    // Validate Số tài khoản
    if (!/^\d{6,19}$/.test(cleanedAccountNumber)) {
      newErrors.accountNumber = "Số tài khoản phải là chuỗi số từ 6-19 ký tự.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- HANDLERS ---
  const handleAddAccount = async () => {
    // Chạy validation trước khi gửi
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const newAccount = await createBankAccount(
        user._id,
        accountNumber.replace(/\s/g, ""), // Gửi đi số tài khoản đã được làm sạch
        bankName,
        accountHolderName.trim().toUpperCase() // Gửi đi tên đã được chuẩn hóa
      );

      addToast({
        title: "Thêm tài khoản thành công!",
        description: "Bây giờ bạn có thể tạo yêu cầu rút tiền.",
        color: "success",
      });

      onAccountAdded(newAccount); // Cập nhật state ở component cha
    } catch (error) {
      console.error("Lỗi khi thêm tài khoản:", error);
      addToast({
        title: "Thêm tài khoản thất bại",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm giúp định dạng số tài khoản cho dễ nhìn
  const formatAccountNumberForDisplay = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); // Chỉ giữ lại số
    // Tự động thêm khoảng trắng sau mỗi 4 ký tự để dễ đọc
    return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  // --- RENDER ---
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-center text-default-600">
        Bạn chưa liên kết tài khoản ngân hàng. Vui lòng thêm tài khoản để tiếp
        tục.
      </p>

      <Select
        label="Ngân hàng"
        placeholder="Chọn ngân hàng của bạn"
        selectedKeys={bankName ? [bankName] : []}
        onSelectionChange={(keys) => setBankName(Array.from(keys)[0] as string)}
        isInvalid={!!errors.bankName}
        errorMessage={errors.bankName}
        isRequired
        aria-label="Chọn ngân hàng"
      >
        {supportedBanks.map((bank) => (
          <SelectItem key={bank.shortName} textValue={bank.shortName}>
            {`${bank.shortName} - ${bank.name}`}
          </SelectItem>
        ))}
      </Select>

      <Input
        label="Số tài khoản"
        placeholder="Nhập số tài khoản ngân hàng"
        value={formatAccountNumberForDisplay(accountNumber)}
        onValueChange={(value) => setAccountNumber(value.replace(/\s/g, ""))} // Lưu giá trị không có khoảng trắng
        isInvalid={!!errors.accountNumber}
        errorMessage={errors.accountNumber}
        isRequired
      />

      <Input
        label="Tên chủ tài khoản"
        placeholder="Ví dụ: NGUYEN VAN A"
        value={accountHolderName}
        onValueChange={(value) => setAccountHolderName(value.toUpperCase())}
        isInvalid={!!errors.accountHolderName}
        errorMessage={errors.accountHolderName}
        description="Viết không dấu, tên phải khớp với tên trên thẻ."
        isRequired
      />

      <Button color="primary" onPress={handleAddAccount} isLoading={isLoading}>
        {isLoading ? "Đang lưu..." : "Lưu và Tiếp tục"}
      </Button>
    </div>
  );
};
