"use client";

import { useState, useEffect, useRef  } from "react";
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
import { SparklesIcon } from "@heroicons/react/24/outline"; 
import { QRCodeCanvas } from "qrcode.react"; 
import { QrCode, Download } from "lucide-react";

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
  const [showQr, setShowQr] = useState(false);

  const isClientWithoutParent =
    user?.roleName === Roles.CLIENT && !user?.parentId;
  const isAgentOrAdmin = user?.roleName && user.roleName !== Roles.CLIENT;

  // Reset state khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setCode("");
      setShowQr(false);
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

  const handleDownloadQr = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode-ref-${myCode}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

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

  const renderAgentView = () => {
  const registerUrl = myCode ? `${window.location.origin}/register?ref=${myCode}` : "";


    return (
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
              <p className="text-sm text-default-500 mb-2">
                Sử dụng mã này hoặc QR code bên dưới để mời khách hàng mới.
              </p>
              <Snippet symbol="" variant="flat" color="primary" size="lg">
                {myCode}
              </Snippet>
              
              {/* --- Vùng hiển thị QR Code --- */}
              {showQr && (
                <div className="mt-4 flex flex-col items-center gap-4 p-4 bg-default-100 rounded-lg">
                   <QRCodeCanvas 
                     id="qr-code-canvas" // Thêm id để tải về
                     value={registerUrl} 
                     size={200}
                     bgColor={"#ffffff"}
                     fgColor={"#000000"}
                     level={"L"}
                     includeMargin={true}
                   />
                   <Button 
                     color="primary" 
                     variant="flat"
                     startContent={<Download size={16} />}
                     onPress={handleDownloadQr}
                   >
                     Tải QR Code
                   </Button>
                </div>
              )}
            </>
          ) : (
             // --- Giao diện tạo mã (giữ nguyên) ---
             <div className="flex flex-col gap-4">
              <p className="text-sm text-default-500">
                Bạn chưa có mã giới thiệu. Hãy tạo một mã để bắt đầu.
              </p>
              <Input
                label="Nhập mã bạn muốn"
                placeholder="Ví dụ: MYSHOP, ANHQUAN"
                variant="bordered"
                value={code}
                onValueChange={(value) => setCode(value.toUpperCase())}
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
          {myCode && !myCodeLoading && (
            // Nút để bật/tắt QR
            <Button 
              variant="bordered"
              onPress={() => setShowQr(!showQr)}
              startContent={<QrCode size={16} />}
              className="mr-auto" // Đẩy nút này sang trái
            >
              {showQr ? "Ẩn QR" : "Hiển thị QR"}
            </Button>
          )}

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
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        {isClientWithoutParent && renderClientView()}
        {isAgentOrAdmin && renderAgentView()}
      </ModalContent>
    </Modal>
  );
};
