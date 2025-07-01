// src/components/Navbar.tsx

"use client";

// React & Next.js imports
import NextLink from "next/link";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { useDisclosure } from "@heroui/use-disclosure";
import { WithdrawalModal } from "./common/WithdrawalModal";
import { useState } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import { link as linkStyles } from "@heroui/theme";

import { useAuth } from "@/providers/AuthProvider";

// Redux store imports
import { useAppSelector, useAppDispatch } from "@/lib/hook";
import {
  clearUser,
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthLoading,
} from "@/store/slices/authSlice";

// Local component imports
import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { Chip } from "@heroui/chip";

// --- Constants and Helper Functions ---

const Roles = {
  ADMIN: "Admin",
  AGENT_LV1: "AgentLv1",
  AGENT_LV2: "AgentLv2",
  CLIENT: "Client",
};

const guestNavItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

const clientNavItems = [
  { label: "Đặt vé", href: "/" },
  { label: "Lịch sử đặt vé", href: "/my-tickets" },
  { label: "Yêu cầu", href: "/my-requests" },
];

const agent2NavItems = [
  { label: "Bảng điều khiển", href: "/agent" },
  { label: "Quản lý Khách hàng", href: "/users" },
  { label: "Báo cáo Vé", href: "/requests" },
  { label: "Vé đã đặt", href: "/tickets" },
];

const agent1NavItems = [
  { label: "Bảng điều khiển", href: "/agent" },
  { label: "Quản lý Khách hàng", href: "/users" },
  { label: "Yêu cầu", href: "/requests" },
  { label: "Vé đã đặt", href: "/tickets" },
];

const adminNavItems = [
  { label: "Bảng điều khiển", href: "/admin/dashboard" },
  { label: "Quản lý hệ thống", href: "/admin/system" },
];

const getNavItemsByRole = (role: string | null) => {
  switch (role) {
    case Roles.CLIENT:
      return clientNavItems;
    case Roles.AGENT_LV2:
      return agent2NavItems;
    case Roles.AGENT_LV1:
      return agent1NavItems;
    case Roles.ADMIN:
      return adminNavItems;
    default:
      return guestNavItems;
  }
};

// --- Main Navbar Component ---

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectAuthLoading);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navItems = getNavItemsByRole(user?.roleName || null);

  const { logout } = useAuth();

  const handleLogout = () => {
    dispatch(clearUser());
    logout();
  };

  const AuthButtons = () => (
    <NavbarItem className="hidden md:flex gap-2">
      <Button as={NextLink} color="primary" href="/login" variant="bordered">
        Đăng nhập
      </Button>
      <Button as={NextLink} color="primary" href="/register" variant="flat">
        Đăng ký
      </Button>
    </NavbarItem>
  );

  const formatCurrency = (amount: number | undefined) => {
    if (typeof amount !== "number") return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Component cho menu người dùng đã đăng nhập
  const UserSection = () => {
    let dashboardHref = "/profile";
    switch (user?.roleName) {
      // ... (giữ nguyên logic switch case)
      case Roles.ADMIN:
        dashboardHref = "/admin/dashboard";
        break;
      case Roles.AGENT_LV1:
        dashboardHref = "/agency/dashboard";
        break;
      case Roles.AGENT_LV2:
        dashboardHref = "/agent/dashboard";
        break;
    }

    return (
      <div className="flex items-center gap-4">
        {/* NEW: Khu vực hiển thị và kích hoạt modal số dư */}
        <Button
          variant="light"
          className="flex flex-col items-end p-0 h-auto"
          onPress={onOpen}
        >
          <Chip className="font-bold">{formatCurrency(user?.amount)}</Chip>
        </Button>

        {/* User Dropdown Menu */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name={user?.fullName}
              size="sm"
              src=""
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Đã đăng nhập với</p>
              <p className="font-semibold">{user?.email}</p>
            </DropdownItem>
            <DropdownItem key="dashboard" as={NextLink} href={dashboardHref}>
              Bảng điều khiển
            </DropdownItem>
            <DropdownItem key="settings" as={NextLink} href="/profile">
              Hồ sơ của tôi
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={handleLogout}>
              Đăng xuất
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };

  const AuthSection = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="w-20 h-8 rounded-lg" />
          <Skeleton className="flex rounded-full w-8 h-8" />
        </div>
      );
    }

    return isAuthenticated ? <UserSection /> : <AuthButtons />;
  };

  return (
    <>
      <HeroUINavbar
        className="bg-background/80 backdrop-blur-md border-b border-divider shadow-sm"
        maxWidth="xl"
        position="sticky"
      >
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <Logo />
              <p className="font-bold text-inherit">BookingCar</p>
            </NextLink>
          </NavbarBrand>
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                    { "text-primary font-medium": pathname === item.href }
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden md:flex">
            <ThemeSwitch />
          </NavbarItem>
          <AuthSection />
        </NavbarContent>

        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <ThemeSwitch />
          <NavbarMenuToggle aria-label="Mở / Đóng menu" />
        </NavbarContent>

        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {navItems.map((item, index) => (
              <NavbarMenuItem key={`${item.label}-${index}`}>
                <NextLink
                  className="block w-full text-lg text-foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarMenuItem>
            ))}
            <div className="my-2 border-t border-default-200" />
            {isAuthenticated ? (
              <>
                <NavbarMenuItem>
                  <NextLink
                    className="block w-full text-lg text-foreground"
                    href="/profile"
                  >
                    Hồ sơ
                  </NextLink>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <button
                    className="block w-full text-left text-lg text-danger"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </NavbarMenuItem>
              </>
            ) : (
              <>
                <NavbarMenuItem>
                  <Button fullWidth as={NextLink} href="/login" variant="flat">
                    Đăng nhập
                  </Button>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <Button
                    fullWidth
                    as={NextLink}
                    color="primary"
                    href="/register"
                  >
                    Đăng ký
                  </Button>
                </NavbarMenuItem>
              </>
            )}
          </div>
        </NavbarMenu>
        <WithdrawalModal isOpen={isOpen} onClose={onClose} />
      </HeroUINavbar>
    </>
  );
};
