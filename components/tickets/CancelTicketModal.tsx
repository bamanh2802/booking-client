"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface CancelTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const CancelTicketModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: CancelTicketModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="font-bold">Xác nhận Hủy Vé</ModalHeader>
            <ModalBody>
              <p>
                Bạn có chắc chắn muốn hủy vé này không? Hành động này không thể
                hoàn tác.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Vui lòng kiểm tra chính sách hủy vé để biết về các khoản phí có
                thể áp dụng.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button disabled={isLoading} variant="light" onPress={close}>
                Không
              </Button>
              <Button color="danger" isLoading={isLoading} onPress={onConfirm}>
                {isLoading ? "Đang xử lý..." : "Chắc chắn"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
