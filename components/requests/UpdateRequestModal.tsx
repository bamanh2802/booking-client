"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

import { TicketRequestStatus } from "@/types";

interface UpdateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  requestInfo: TicketRequestStatus;
}

export const UpdateRequestModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  requestInfo,
}: UpdateRequestModalProps) => {
  if (!requestInfo) return null;

  const isApproving = requestInfo === "Confirmed";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="font-bold">
              Xác nhận {isApproving ? "Duyệt" : "Từ chối"} Yêu cầu
            </ModalHeader>
            <ModalBody>
              <p>
                Bạn có chắc chắn muốn{" "}
                <span className={isApproving ? "text-success" : "text-danger"}>
                  {isApproving ? "DUYỆT" : "TỪ CHỐI"}
                </span>{" "}
                yêu cầu này không?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button disabled={isLoading} variant="light" onPress={close}>
                Hủy
              </Button>
              <Button
                color={isApproving ? "success" : "danger"}
                isLoading={isLoading}
                onPress={onConfirm}
              >
                Xác nhận
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
