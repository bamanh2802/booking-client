// src/components/Navbar.tsx

"use client";

// React & Next.js imports
import NextLink from "next/link";
// **STEP 1: Import useRouter**
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { useDisclosure } from "@heroui/use-disclosure";
import { WithdrawalModal } from "./common/WithdrawalModal";
import { NotificationBell } from "./common/NotificationBell";
import { PlusIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
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
import { ReferralCodeModal } from "./common/ReferralCodeModal";
import { useDisclosure as useReferralDisclosure } from "@heroui/use-disclosure";

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

// --- Type Definitions ---
type NavItem = {
  label: string;
  href: string;
  isDropdown?: false;
};

type NavDropdown = {
  label: string;
  isDropdown: true;
  items: { label: string; href: string }[];
};

type NavigationLink = NavItem | NavDropdown;

// --- Constants and Helper Functions ---
const Roles = {
  ADMIN: "Admin",
  AGENT_LV1: "AgentLv1",
  AGENT_LV2: "AgentLv2",
  CLIENT: "Client",
};

const guestNavItems: NavigationLink[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

const clientNavItems: NavigationLink[] = [
  { label: "Đặt vé", href: "/" },
  { label: "Lịch sử đặt vé", href: "/my-tickets" },
  { label: "Yêu cầu của tôi", href: "/my-requests" },
];

const agentNavItems: NavigationLink[] = [
  { label: "Bảng điều khiển", href: "/agent" },
  { label: "Quản lý Khách hàng", href: "/users" },
  {
    label: "Yêu cầu",
    isDropdown: true,
    items: [
      { label: "Yêu cầu của tôi", href: "/my-requests" },
      { label: "Quản lý yêu cầu", href: "/requests" },
    ],
  },
  {
    label: "Vé",
    isDropdown: true,
    items: [
      { label: "Vé của tôi", href: "/my-tickets" },
      { label: "Quản lý vé", href: "/tickets" },
    ],
  },
];

const adminNavItems: NavigationLink[] = [
  { label: "Bảng điều khiển", href: "/admin/dashboard" },
  { label: "Quản lý hệ thống", href: "/admin/system" },
];

const getNavItemsByRole = (role: string | null): NavigationLink[] => {
  switch (role) {
    case Roles.CLIENT:
      return clientNavItems;
    case Roles.AGENT_LV1:
    case Roles.AGENT_LV2:
      return agentNavItems;
    case Roles.ADMIN:
      return adminNavItems;
    default:
      return guestNavItems;
  }
};

// --- Main Navbar Component ---

export const Navbar = () => {
  const pathname = usePathname();
  // **STEP 2: Initialize the router**
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectAuthLoading);

  const navItems = getNavItemsByRole(user?.roleName || null);
  const showReferralOption =
    (user?.roleName === Roles.CLIENT && !user?.parentId) ||
    (user?.roleName && user.roleName !== Roles.CLIENT);

  const { logout } = useAuth();
  const {
    isOpen: isReferralOpen,
    onOpen: onReferralOpen,
    onClose: onReferralClose,
  } = useReferralDisclosure();
  const {
    isOpen: isWithdrawalOpen,
    onOpen: onWithdrawalOpen,
    onClose: onWithdrawalClose,
  } = useDisclosure();

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

  const UserSection = () => {
    return (
      <div className="flex items-center gap-4">
        <Chip onClick={onWithdrawalOpen} className="font-bold cursor-pointer">
          <div className="flex items-center justify-center">
            <PlusIcon className="w-4 h-4 mr-1" />
            {formatCurrency(user?.amount)}
          </div>
        </Chip>
        <NotificationBell />
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
            <DropdownItem key="settings" as={NextLink} href="/profile">
              Hồ sơ của tôi
            </DropdownItem>
            {showReferralOption && (
              <DropdownItem key="referral" onPress={onReferralOpen}>
                Mã giới thiệu
              </DropdownItem>
            )}
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
              <img
                src="/assets/logo.png"
                alt="VeXeNay Logo"
                className="h-10 w-auto"
              />
            </NextLink>
          </NavbarBrand>
          <ul className="hidden lg:flex gap-4 justify-start items-center ml-2">
            {navItems.map((item) => {
              if ("items" in item) {
                const isDropdownActive = item.items.some(
                  (subItem) => pathname === subItem.href
                );
                return (
                  <NavbarItem key={item.label}>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          disableRipple
                          className={clsx(
                            linkStyles({ color: "foreground" }),
                            "p-0 bg-transparent data-[hover=true]:bg-transparent",
                            { "text-primary font-medium": isDropdownActive }
                          )}
                          endContent={<ChevronDownIcon className="w-4 h-4" />}
                          radius="sm"
                          variant="light"
                        >
                          {item.label}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label={`${item.label} actions`}
                        items={item.items}
                      >
                        {(subItem) => (
                          // **STEP 3: Use onPress for navigation**
                          <DropdownItem
                            key={subItem.href}
                            onPress={() => router.push(subItem.href)}
                            className={clsx({
                              "text-primary": pathname === subItem.href,
                            })}
                          >
                            {subItem.label}
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </NavbarItem>
                );
              } else {
                return (
                  <NavbarItem key={item.label}>
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
                );
              }
            })}
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

        {/* --- MOBILE MENU (No change needed here as it uses NextLink directly) --- */}
        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {navItems.map((item, index) => {
              if ("items" in item) {
                return (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex flex-col gap-2"
                  >
                    <NavbarMenuItem>
                      <p className="font-semibold text-default-600">
                        {item.label}
                      </p>
                    </NavbarMenuItem>
                    {item.items.map((subItem, subIndex) => (
                      <NavbarMenuItem key={`${subItem.label}-${subIndex}`}>
                        <NextLink
                          href={subItem.href}
                          className={clsx(
                            "block w-full text-lg pl-4",
                            pathname === subItem.href
                              ? "text-primary font-medium"
                              : "text-foreground"
                          )}
                        >
                          {subItem.label}
                        </NextLink>
                      </NavbarMenuItem>
                    ))}
                  </div>
                );
              } else {
                return (
                  <NavbarMenuItem key={`${item.label}-${index}`}>
                    <NextLink
                      className={clsx(
                        "block w-full text-lg",
                        pathname === item.href
                          ? "text-primary font-medium"
                          : "text-foreground"
                      )}
                      href={item.href}
                    >
                      {item.label}
                    </NextLink>
                  </NavbarMenuItem>
                );
              }
            })}
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
                {showReferralOption && (
                  <NavbarMenuItem key="referral" onClick={onReferralOpen}>
                    <button className="block w-full text-left text-lg">
                      Mã giới thiệu
                    </button>
                  </NavbarMenuItem>
                )}
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
        <WithdrawalModal
          isOpen={isWithdrawalOpen}
          onClose={onWithdrawalClose}
        />
        {user && (
          <ReferralCodeModal
            isOpen={isReferralOpen}
            onClose={onReferralClose}
          />
        )}
      </HeroUINavbar>
    </>
  );
};
