/**
 * @file Component Modal chính, đóng vai trò điều phối, hiển thị nội dung phù hợp.
 */
"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useAppSelector } from "@/lib/hook";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { useBankAccount } from "../Withdrawal/useBankAccount";
import { AddBankAccountForm } from "../Withdrawal/AddBankAccountForm";
import { CreateRequestForm } from "./CreateRequestForm";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawalModal = ({ isOpen, onClose }: WithdrawalModalProps) => {
  const user = useAppSelector(selectCurrentUser);
  const {
    bankAccount,
    setBankAccount,
    isLoading: isLoadingAccount,
  } = useBankAccount(user?._id);

  if (!user) {
    return null;
  }

  const renderBodyContent = (onCloseHandler: () => void) => {
    if (isLoadingAccount) {
      return (
        <div className="flex justify-center items-center h-48">
          <p>Đang tải thông tin tài khoản...</p>
        </div>
      );
    }

    if (bankAccount) {
      return (
        <CreateRequestForm
          user={user}
          bankAccount={bankAccount}
          onClose={onCloseHandler}
        />
      );
    }

    return <AddBankAccountForm user={user} onAccountAdded={setBankAccount} />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onCloseHandler) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {bankAccount
                ? "Tạo Yêu Cầu Rút Tiền"
                : "Thêm Tài Khoản Ngân Hàng"}
            </ModalHeader>
            <ModalBody>{renderBodyContent(onCloseHandler)}</ModalBody>
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
