"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter để điều hướng

// Giả định bạn có component Modal từ @heroui
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Icon } from "@iconify/react";
import { ChevronLeft } from "lucide-react";

import { register } from "@/services/auth"; // Giả định service này đã tồn tại

export default function RegisterForm() {
  const router = useRouter();

  // State cho các trường input
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // State cho các chức năng của UI
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // State để xử lý logic bất đồng bộ và modal
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Hàm xử lý khi người dùng gửi form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Kiểm tra xem người dùng đã đồng ý điều khoản chưa
    if (!agreedToTerms) {
      setError("Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.");

      return;
    }

    setIsLoading(true);

    try {
      await register(fullName, email, phone, password);
      // Nếu thành công, mở modal thay vì điều hướng ngay lập tức
      setIsSuccessModalOpen(true);
    } catch (e) {
      console.error(e);
      // Hiển thị thông báo lỗi thân thiện
      setError(
        "Đăng ký thất bại. Email hoặc số điện thoại có thể đã được sử dụng.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    setIsSuccessModalOpen(false);
    router.push("/login");
  };

  return (
    <>
      <div className="w-full max-w-md bg-content1 p-8 rounded-large shadow-medium">
        <Link
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          href="/"
        >
          <ChevronLeft />
          Trở về
        </Link>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Tạo tài khoản
          </h1>
          <p className="text-sm text-default-500">
            Đăng ký để bắt đầu sử dụng dịch vụ của chúng tôi
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Button
              className="w-full"
              color="default"
              startContent={
                <Icon height="20" icon="logos:google-icon" width="20" />
              }
              variant="flat"
            >
              Đăng ký với Google
            </Button>
          </div>

          <div className="relative">
            <Divider className="my-4" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-content1 px-2 text-tiny text-default-400">
              Hoặc
            </span>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <Input
                isRequired
                label="Họ và tên"
                placeholder="Nguyen Van A"
                value={fullName}
                variant="bordered"
                onValueChange={setFullName}
              />
              <Input
                isRequired
                label="Số điện thoại"
                placeholder="0123456789"
                value={phone}
                variant="bordered"
                onValueChange={setPhone}
              />
            </div>
            <Input
              isRequired
              label="Email"
              placeholder="nguyenvana@gmail.com"
              type="email"
              value={email}
              variant="bordered"
              onValueChange={setEmail}
            />
            <Input
              isRequired
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    className="text-2xl text-default-400"
                    icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                  />
                </button>
              }
              label="Mật khẩu"
              placeholder="Nhập mật khẩu của bạn"
              type={showPassword ? "text" : "password"}
              value={password}
              variant="bordered"
              onValueChange={setPassword}
            />
            <Checkbox
              color="primary"
              isSelected={agreedToTerms}
              size="sm"
              onValueChange={setAgreedToTerms}
            >
              <span className="text-sm text-default-500">
                Tôi đồng ý với{" "}
                <Link href="#" size="sm">
                  Điều khoản dịch vụ
                </Link>{" "}
                và{" "}
                <Link href="#" size="sm">
                  Chính sách bảo mật
                </Link>
              </span>
            </Checkbox>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && (
              <div className="bg-danger-50 text-danger-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              className="w-full"
              color="primary"
              disabled={isLoading || !agreedToTerms}
              isLoading={isLoading}
              size="lg"
              type="submit"
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </form>

          <p className="text-center text-sm text-default-500">
            Đã có tài khoản?{" "}
            <Link href="/login" size="sm">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>

      {/* Modal thông báo thành công */}
      <Modal
        hideCloseButton // Ẩn nút X
        isDismissable={false} // Không cho đóng khi click ra ngoài
        isOpen={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-center">
            Đăng ký thành công!
          </ModalHeader>
          <ModalBody>
            <p className="text-center">
              Tài khoản của bạn đã được tạo. Vui lòng chuyển đến trang đăng nhập
              để bắt đầu.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              className="w-full"
              color="primary"
              onPress={handleGoToLogin}
            >
              Tới trang Đăng nhập
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
