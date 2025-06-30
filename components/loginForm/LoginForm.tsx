// src/components/auth/SignInForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Icon } from "@iconify/react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { addToast } from "@heroui/toast";

import { useAppDispatch } from "@/lib/hook";
import { login } from "@/services/auth";
import { setUser } from "@/store/slices/authSlice";

export default function SignInForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // --- State của Component ---
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // "Giữ tôi đăng nhập"

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    api?: string;
  }>({});

  // --- Hàm xử lý thay đổi input, gọn gàng hơn ---
  const handleChange = (field: "email" | "password", value: string) => {
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

  // --- Hàm validation phía client ---
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email của bạn.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Địa chỉ email không hợp lệ.";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --- Hàm xử lý Submit ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return; // Dừng lại nếu form không hợp lệ

    setIsLoading(true);
    setErrors({});

    try {
      // Gọi API đăng nhập
      const response = await login(formData.email, formData.password);

      // --- SỬA LỖI LOGIC QUAN TRỌNG NHẤT ---
      // Chỉ dispatch và chuyển hướng khi API trả về thành công
      if (response?.success && response.data) {
        dispatch(setUser(response.data));

        addToast({
          title: "Đăng nhập thành công!",
          description: `Chào mừng trở lại, ${response.data.user.fullName}.`,
          color: "success",
        });

        router.push("/"); // CHỈ CHUYỂN HƯỚNG KHI THÀNH CÔNG
      } else {
        // Xử lý trường hợp API trả về success: false hoặc không có data
        setErrors({
          api: response?.message || "Thông tin đăng nhập không chính xác.",
        });
      }
    } catch (err: any) {
      // Xử lý lỗi từ axios (vd: 401, 500)
      const errorMessage =
        err.response?.data?.message ||
        "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.";

      setErrors({ api: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-content1 p-6 sm:p-8 rounded-large shadow-medium">
      <Link
        className="inline-flex items-center text-sm text-default-500 transition-colors hover:text-foreground mb-6"
        href="/"
      >
        <ChevronLeft className="mr-1" size={16} />
        Trở về trang chủ
      </Link>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Đăng nhập</h1>
        <p className="text-sm text-default-500 mt-2">
          Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
        </p>
      </div>

      <div className="space-y-6">
        {/* Nút đăng nhập với Google (tùy chọn) */}
        <Button
          className="w-full"
          startContent={
            <Icon height="20" icon="logos:google-icon" width="20" />
          }
          variant="bordered"
        >
          Đăng nhập với Google
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
            autoComplete="email"
            errorMessage={errors.email}
            isInvalid={!!errors.email || !!errors.api}
            label="Email"
            placeholder="nguyenvana@gmail.com"
            type="email"
            value={formData.email}
            variant="bordered"
            onValueChange={(v) => handleChange("email", v)}
          />
          <Input
            isRequired
            autoComplete="current-password"
            endContent={
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="focus:outline-none"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <Eye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            errorMessage={errors.password}
            isInvalid={!!errors.password || !!errors.api}
            label="Mật khẩu"
            placeholder="Nhập mật khẩu của bạn"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            variant="bordered"
            onValueChange={(v) => handleChange("password", v)}
          />

          {/* Hiển thị lỗi từ API */}
          {errors.api && (
            <div className="bg-danger-50 text-danger p-3 rounded-md text-sm font-medium">
              {errors.api}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Checkbox
              isSelected={rememberMe}
              size="sm"
              onValueChange={setRememberMe}
            >
              <span className="text-sm text-default-500">
                Ghi nhớ đăng nhập
              </span>
            </Checkbox>
            <Link color="primary" href="/forgot-password" size="sm">
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            className="w-full"
            color="primary"
            isLoading={isLoading}
            size="lg"
            type="submit"
          >
            Đăng nhập
          </Button>
        </form>

        <p className="text-center text-sm text-default-500">
          Chưa có tài khoản?{" "}
          <Link color="primary" href="/register" size="sm">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
