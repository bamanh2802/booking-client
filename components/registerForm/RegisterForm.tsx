// src/components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

import { register } from "@/services/auth";

export default function RegisterForm() {
  const router = useRouter();

  // --- States ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    referralCode: "", // Thêm state cho mã giới thiệu
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // --- Handlers ---
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[field] || errors.api) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        delete newErrors.api;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Địa chỉ email không hợp lệ.";
    }
    if (!formData.phone.trim())
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (!agreedToTerms) {
      newErrors.terms = "Bạn phải đồng ý với các điều khoản của chúng tôi.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await register(
        formData.fullName,
        formData.email,
        formData.phone,
        formData.password,
        formData.referralCode 
      );
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Email hoặc số điện thoại có thể đã được sử dụng.";
      setErrors({ api: errorMessage });
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
      <div className="w-screen h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Cột trái - Branding (ẩn trên mobile) */}
        <div className="hidden md:flex relative flex-col items-start justify-end p-12 text-white bg-gray-900">
          <div className="absolute inset-0 z-0">
            <img
              src="assets/login.jpg"
              alt="Road with a car"
              className="w-full h-full object-cover opacity-30"
            />
          </div>
          <div className="relative z-10">
            <Link href="/" className="text-2xl font-bold">
              BookingCar
            </Link>
            <h2 className="text-4xl font-bold mt-4 leading-tight">
              Bắt đầu hành trình,
            </h2>
            <p className="text-4xl font-light">mở ra trải nghiệm mới.</p>
            <p className="mt-6 text-lg text-gray-300 max-w-md">
              Chỉ vài bước đơn giản để trở thành thành viên và tận hưởng những
              ưu đãi độc quyền.
            </p>
          </div>
        </div>

        {/* Cột phải - Form */}
        <div className="relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-content1 overflow-y-auto">
          <Link
            href="/"
            className="absolute top-6 right-6 flex items-center gap-2 text-sm font-semibold text-default-600 hover:text-primary transition-colors"
            aria-label="Quay về trang chủ"
          >
            <ChevronLeft size={16} />
            <span>Về Trang Chủ</span>
          </Link>
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-foreground">
                Tạo Tài Khoản
              </h1>
              <p className="text-sm text-default-500 mt-2">
                Nhanh chóng và hoàn toàn miễn phí.
              </p>
            </div>

            <div className="space-y-6">
              <Button
                className="w-full"
                startContent={
                  <Icon height="20" icon="logos:google-icon" width="20" />
                }
                variant="bordered"
              >
                Đăng ký với Google
              </Button>
              <div className="relative">
                <Divider />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-content1 px-2 text-tiny text-default-400">
                  HOẶC
                </span>
              </div>
              <form noValidate className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  isRequired
                  label="Họ và tên"
                  errorMessage={errors.fullName}
                  isInvalid={!!errors.fullName}
                  onValueChange={(v) => handleChange("fullName", v)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    isRequired
                    label="Email"
                    type="email"
                    errorMessage={errors.email}
                    isInvalid={!!errors.email}
                    onValueChange={(v) => handleChange("email", v)}
                  />
                  <Input
                    isRequired
                    label="Số điện thoại"
                    type="tel"
                    errorMessage={errors.phone}
                    isInvalid={!!errors.phone}
                    onValueChange={(v) => handleChange("phone", v)}
                  />
                </div>
                <Input
                  isRequired
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  }
                  errorMessage={errors.password}
                  isInvalid={!!errors.password}
                  onValueChange={(v) => handleChange("password", v)}
                />

                {/* --- Input Mã Giới Thiệu (Tùy chọn) --- */}
                <Input
                  label="Mã giới thiệu (tùy chọn)"
                  onValueChange={(v) => handleChange("referralCode", v)}
                />
                {/* -------------------------------------- */}
                
                <Checkbox
                  isSelected={agreedToTerms}
                  size="sm"
                  onValueChange={setAgreedToTerms}
                  isInvalid={!!errors.terms}
                >
                  <span className="text-sm">
                    Tôi đồng ý với{" "}
                    <Link color="primary" href="/terms" size="sm">
                      Điều khoản
                    </Link>{" "}
                    và{" "}
                    <Link color="primary" href="/privacy" size="sm">
                      Chính sách bảo mật
                    </Link>
                    .
                  </span>
                </Checkbox>

                {errors.api && (
                  <div className="bg-danger-50 text-danger p-3 rounded-md text-sm font-medium">
                    {errors.api}
                  </div>
                )}

                <Button
                  className="w-full"
                  color="primary"
                  isLoading={isLoading}
                  size="lg"
                  type="submit"
                >
                  Đăng Ký
                </Button>
              </form>
              <p className="text-center text-sm text-default-500">
                Đã có tài khoản?{" "}
                <Link
                  color="primary"
                  href="/login"
                  size="sm"
                  className="font-semibold"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thông báo thành công */}
      <Modal
        hideCloseButton
        isDismissable={false}
        isOpen={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-center">
            <Icon
              icon="solar:check-circle-bold"
              className="mx-auto text-5xl text-success"
            />
            Đăng Ký Thành Công!
          </ModalHeader>
          <ModalBody>
            <p className="text-center">
              Tài khoản của bạn đã được tạo. Chào mừng bạn đến với BookingCar!
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