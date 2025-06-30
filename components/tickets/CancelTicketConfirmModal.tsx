// src/components/tickets/CancelTicketConfirmModal.tsx
"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface CancelTicketConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const CancelTicketConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: CancelTicketConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader>Xác nhận Hủy vé</ModalHeader>
            <ModalBody>
              <p>
                Bạn có chắc chắn muốn hủy vé này không? Hành động này không thể
                hoàn tác.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button disabled={isLoading} variant="light" onPress={close}>
                Không
              </Button>
              <Button color="danger" isLoading={isLoading} onPress={onConfirm}>
                Có, Hủy vé
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
