"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface DeleteUserConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const DeleteUserConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteUserConfirmModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalContent>
      {(close) => (
        <>
          <ModalHeader className="font-bold">Xác nhận Xóa</ModalHeader>
          <ModalBody>
            <p>
              Bạn có chắc chắn muốn xóa người dùng này? Dữ liệu của họ sẽ bị mất
              vĩnh viễn.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button disabled={isLoading} variant="light" onPress={close}>
              Hủy
            </Button>
            <Button color="danger" isLoading={isLoading} onPress={onConfirm}>
              Xóa
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);
