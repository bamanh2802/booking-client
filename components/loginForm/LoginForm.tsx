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
import { ChevronLeft, Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";
import { addToast } from "@heroui/toast";

import { useAppDispatch } from "@/lib/hook";
import { login } from "@/services/auth";
// TODO: Tạo service/function để xử lý API quên mật khẩu
// import { forgotPassword } from "@/services/auth";
import { setUser } from "@/store/slices/authSlice";

// --- Sub-component cho Form Đăng Nhập ---
const SignInView = ({
  onForgotPasswordClick,
}: {
  onForgotPasswordClick: () => void;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    api?: string;
  }>({});

  const handleChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Địa chỉ email không hợp lệ.";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
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
      const response = await login(formData.email, formData.password);
      if (response?.success && response.data) {
        dispatch(setUser(response.data));
        addToast({
          title: "Đăng nhập thành công!",
          description: `Chào mừng trở lại, ${response.data.user.fullName}.`,
          color: "success",
        });
        router.push("/");
      } else {
        setErrors({
          api: response?.message || "Thông tin đăng nhập không chính xác.",
        });
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Email hoặc mật khẩu không chính xác.";
      setErrors({ api: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Đăng nhập</h1>
        <p className="text-sm text-default-500 mt-2">
          Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
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
            onValueChange={(v) => handleChange("email", v)}
          />
          <Input
            isRequired
            autoComplete="current-password"
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            }
            errorMessage={errors.password}
            isInvalid={!!errors.password || !!errors.api}
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            onValueChange={(v) => handleChange("password", v)}
          />
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
              Ghi nhớ đăng nhập
            </Checkbox>
            <Button
              variant="light"
              color="primary"
              size="sm"
              className="p-0 h-auto font-semibold"
              onPress={onForgotPasswordClick}
            >
              Quên mật khẩu?
            </Button>
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
          <Link
            color="primary"
            href="/register"
            size="sm"
            className="font-semibold"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </>
  );
};

const ForgotPasswordView = ({
  onBackToSignIn,
}: {
  onBackToSignIn: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Vui lòng nhập một địa chỉ email hợp lệ.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      // TODO: Thay thế bằng API thật
      // await forgotPassword(email);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả lập API
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="light"
        size="sm"
        className="mb-6 -ml-2"
        startContent={<ArrowLeft size={16} />}
        onPress={onBackToSignIn}
      >
        Quay lại Đăng nhập
      </Button>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Quên Mật Khẩu</h1>
        <p className="text-sm text-default-500 mt-2">
          Đừng lo lắng! Nhập email của bạn để lấy lại mật khẩu.
        </p>
      </div>

      {isSuccess ? (
        <div className="text-center bg-success-100 text-success-700 p-4 rounded-lg space-y-2">
          <Icon icon="solar:check-circle-bold" className="mx-auto text-4xl" />
          <h3 className="font-bold">Kiểm tra email của bạn</h3>
          <p className="text-sm">
            Chúng tôi đã gửi một mật khẩu mới đến <strong>{email}</strong>. Vui
            lòng kiểm tra hộp thư đến (và cả mục spam).
          </p>
        </div>
      ) : (
        <form noValidate className="space-y-4" onSubmit={handleSubmit}>
          <Input
            isRequired
            type="email"
            label="Email"
            placeholder="Nhập email đã đăng ký"
            value={email}
            onValueChange={setEmail}
            isInvalid={!!error}
            errorMessage={error}
            startContent={<Mail className="text-default-400" />}
          />
          <Button
            className="w-full"
            color="primary"
            isLoading={isLoading}
            size="lg"
            type="submit"
          >
            Gửi Hướng Dẫn
          </Button>
        </form>
      )}
    </>
  );
};

export default function SignInForm() {
  const [view, setView] = useState<"signin" | "forgot-password">("signin");

  return (
    <div className="w-screen h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Cột trái - Branding (ẩn trên mobile) */}
      <div className="hidden md:flex relative flex-col items-start justify-end p-12 text-white bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="assets/login.jpg"
            alt="Car on a city road"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10">
          <Link href="/" className="text-2xl font-bold">
            BookingCar
          </Link>
          <h2 className="text-4xl font-bold mt-4 leading-tight">
            Hành trình của bạn,
          </h2>
          <p className="text-4xl font-light">bắt đầu từ đây.</p>
          <p className="mt-6 text-lg text-gray-300 max-w-md">
            Trải nghiệm dịch vụ đặt xe cao cấp, an toàn và đáng tin cậy. Đăng
            nhập để quản lý các chuyến đi của bạn.
          </p>
        </div>
      </div>

      {/* Cột phải - Form */}
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-content1">
        <Link
          href="/"
          className="absolute top-6 right-6 flex items-center gap-2 text-sm font-semibold text-default-600 hover:text-primary transition-colors"
          aria-label="Quay về trang chủ"
        >
          <ChevronLeft size={16} />
          <span>Về Trang Chủ</span>
        </Link>

        <div className="w-full max-w-md">
          {view === "signin" ? (
            <SignInView
              onForgotPasswordClick={() => setView("forgot-password")}
            />
          ) : (
            <ForgotPasswordView onBackToSignIn={() => setView("signin")} />
          )}
        </div>
      </div>
    </div>
  );
}
