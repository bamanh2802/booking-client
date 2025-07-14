"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

// Redux Imports
import { useAppSelector, useAppDispatch } from "@/lib/hook";
import {
  setUser,
  clearUser,
  setLoading,
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthLoading,
  UserData,
} from "@/store/slices/authSlice";

import { getUserInfo, logoutAuth } from "@/services/auth";

import { FullScreenLoader } from "@/components/loading/FullScreenLoader";

const GUEST_ROUTES = ["/login", "/register"];
const PROTECTED_ROUTES = ["/profile", "/my-tickets", "/agent", "/admin"];
const DEFAULT_REDIRECT_AUTHENTICATED = "/";
const DEFAULT_REDIRECT_UNAUTHENTICATED = "/login";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: UserData | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);

  useEffect(() => {
    if (loading) {
      return;
    }

    const isGuestRoute = GUEST_ROUTES.includes(pathname);
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isAuthenticated && isGuestRoute) {
      router.push(DEFAULT_REDIRECT_AUTHENTICATED);
    }

    // Kịch bản 2: Chưa đăng nhập nhưng vào trang được bảo vệ
    if (!isAuthenticated && isProtectedRoute) {
      router.push(DEFAULT_REDIRECT_UNAUTHENTICATED);
    }
  }, [isAuthenticated, loading, pathname, router]);

  // AuthGuard chỉ chịu trách nhiệm chuyển hướng, không hiển thị gì thêm
  return <>{children}</>;
};

// --- AuthProvider: Component chính ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Lấy state từ Redux
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectAuthLoading);

  // State để giải quyết lỗi Hydration bằng cách đảm bảo logic chỉ chạy trên client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Đánh dấu component đã được mount trên client
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const checkAuthenticationStatus = async () => {
        try {
          const userData = await getUserInfo();
          dispatch(setUser(userData.data));
        } catch (error) {
          dispatch(clearUser());
        } finally {
          dispatch(setLoading(false));
        }
      };

      checkAuthenticationStatus();
    }
  }, [isMounted, dispatch]);

  const logout = async () => {
    try {
      await logoutAuth();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      dispatch(clearUser());
      router.push(DEFAULT_REDIRECT_UNAUTHENTICATED);
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    loading,
    user,
    logout,
  };
  const showLoader = !isMounted || loading;

  if (showLoader) {
    return <FullScreenLoader />;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      <div className="animate-fade-in">
        <AuthGuard>{children}</AuthGuard>
      </div>
    </AuthContext.Provider>
  );
};

// --- Custom Hook để sử dụng Context ---
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
