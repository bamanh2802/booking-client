"use client";

import { useState, useEffect } from "react";
import { CircularProgress } from "@heroui/progress";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Snippet } from "@heroui/snippet";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useAppSelector } from "@/lib/hook";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { getAgentCode, createAgentCode, clientUseCode } from "@/services/agent";
import { addToast } from "@heroui/toast";
import { SparklesIcon } from "@heroicons/react/24/outline"; // Icon cho nút random

interface ReferralCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Roles = {
  CLIENT: "Client",
};

// Hàm tiện ích để tạo mã ngẫu nhiên
const generateRandomCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

export const ReferralCodeModal = ({
  isOpen,
  onClose,
}: ReferralCodeModalProps) => {
  const user = useAppSelector(selectCurrentUser);
  const [code, setCode] = useState(""); // Dùng cho cả client và agent
  const [myCode, setMyCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [myCodeLoading, setMyCodeLoading] = useState(false);

  const isClientWithoutParent =
    user?.roleName === Roles.CLIENT && !user?.parentId;
  const isAgentOrAdmin = user?.roleName && user.roleName !== Roles.CLIENT;

  // Reset state khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setCode("");
    }
  }, [isOpen]);

  // Fetch mã của agent/admin khi modal mở
  useEffect(() => {
    if (isOpen && isAgentOrAdmin) {
      const fetchMyCode = async () => {
        setMyCodeLoading(true);
        try {
          const response = await getAgentCode();
          if (response.data && response.data.length > 0) {
            setMyCode(response.data[0].code);
          }
        } catch (error) {
          console.error("Failed to fetch agent code:", error);
        } finally {
          setMyCodeLoading(false);
        }
      };
      fetchMyCode();
    }
  }, [isOpen, isAgentOrAdmin]);

  // --- Logic cho Client (giữ nguyên) ---
  const handleClientSubmit = async () => {
    if (!code) {
      addToast({ title: "Vui lòng nhập mã giới thiệu.", color: "danger" });
      return;
    }
    setLoading(true);
    try {
      await clientUseCode(code);
      addToast({
        title: "Sử dụng mã giới thiệu thành công!",
        description: "Thông tin của bạn sẽ sớm được cập nhật.",
        color: "success",
      });
      onClose();
    } catch (error: any) {
      addToast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Logic mới cho Agent ---
  const handleAgentSaveCode = async () => {
    if (!code || code.length < 4) {
      addToast({ title: "Mã phải có ít nhất 4 ký tự.", color: "danger" });
      return;
    }

    if (!code || code.length > 10) {
      addToast({ title: "Mã phải có dưới 10 ký tự.", color: "danger" });
      return;
    }
    setLoading(true);
    try {
      const response = await createAgentCode(code); // Gửi mã người dùng đã nhập
      setMyCode(response.data.code);
      addToast({ title: "Lưu mã thành công!", color: "success" });
    } catch (error: any) {
      addToast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderClientView = () => (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Nhập Mã Giới Thiệu
      </ModalHeader>
      <ModalBody>
        <p className="text-sm text-default-500">
          Nhập mã giới thiệu từ đại lý của bạn để nhận được hỗ trợ tốt hơn.
        </p>
        <Input
          autoFocus
          label="Mã giới thiệu"
          placeholder="Ví dụ: AGENT123"
          variant="bordered"
          value={code}
          onValueChange={setCode}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="flat" onPress={onClose}>
          Hủy
        </Button>
        <Button
          color="primary"
          isLoading={loading}
          onPress={handleClientSubmit}
        >
          Xác nhận
        </Button>
      </ModalFooter>
    </>
  );

  const renderAgentView = () => (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Mã Giới Thiệu Của Bạn
      </ModalHeader>
      <ModalBody>
        {myCodeLoading ? (
          <div className="flex justify-center items-center h-24">
            <CircularProgress aria-label="Loading..." />
          </div>
        ) : myCode ? (
          <>
            <p className="text-sm text-default-500">
              Sử dụng mã này để mời khách hàng mới tham gia hệ thống của bạn.
            </p>
            <Snippet symbol="" variant="flat" color="primary" size="lg">
              {myCode}
            </Snippet>
          </>
        ) : (
          // --- Giao diện mới cho việc tạo mã ---
          <div className="flex flex-col gap-4">
            <p className="text-sm text-default-500">
              Bạn chưa có mã giới thiệu. Hãy tạo một mã để bắt đầu.
            </p>
            <Input
              label="Nhập mã bạn muốn"
              placeholder="Ví dụ: MYSHOP, ANHQUAN"
              variant="bordered"
              value={code}
              onValueChange={(value) => setCode(value.toUpperCase())} // Tự động viết hoa
              description="Mã phải là duy nhất và có ít nhất 4 ký tự."
            />
            <Button
              variant="light"
              color="primary"
              size="sm"
              className="self-start"
              startContent={<SparklesIcon className="w-4 h-4" />}
              onPress={() => setCode(generateRandomCode())}
            >
              Tạo ngẫu nhiên
            </Button>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="flat" onPress={onClose}>
          {myCode ? "Đóng" : "Hủy"}
        </Button>
        {!myCode && !myCodeLoading && (
          <Button
            color="primary"
            isLoading={loading}
            onPress={handleAgentSaveCode}
          >
            Lưu mã
          </Button>
        )}
      </ModalFooter>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        {isClientWithoutParent && renderClientView()}
        {isAgentOrAdmin && renderAgentView()}
      </ModalContent>
    </Modal>
  );
};
