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
import { useCallback, useRef } from "react";

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

  // Ref để track xem modal có đang trong quá trình đóng không
  const isClosingRef = useRef(false);

  // Wrapper function để handle close với proper cleanup
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;

    isClosingRef.current = true;
    onClose();

    // Reset closing flag after animation completes
    setTimeout(() => {
      isClosingRef.current = false;
    }, 300);
  }, [onClose]);

  // Prevent modal from closing when interacting with form elements
  const handleModalContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Handle modal backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      // Only close if clicking on the backdrop, not on the modal content
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  if (!user) {
    return null;
  }

  // Hàm render nội dung chính của modal body
  const renderBodyContent = (onCloseHandler: () => void) => {
    if (isLoadingAccount) {
      return (
        <div className="flex justify-center items-center h-48">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <p className="text-default-600">Đang tải thông tin tài khoản...</p>
          </div>
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
      onOpenChange={(open) => {
        // Chỉ đóng modal khi user thực sự muốn đóng
        if (!open) {
          handleClose();
        }
      }}
      size="xl"
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton={true}
      backdrop="opaque"
      closeButton={null}
    >
      <ModalContent>
        {(onCloseHandler) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">
                {bankAccount
                  ? "Tạo Yêu Cầu Rút Tiền"
                  : "Thêm Tài Khoản Ngân Hàng"}
              </h3>
              {!bankAccount && (
                <p className="text-sm text-default-500 font-normal">
                  Vui lòng thêm tài khoản ngân hàng để tiếp tục
                </p>
              )}
            </ModalHeader>

            <ModalBody className="px-6">
              {renderBodyContent(onCloseHandler)}
            </ModalBody>

            <ModalFooter className="px-6">
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  handleClose();
                }}
                className="min-w-20"
              >
                Hủy
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
