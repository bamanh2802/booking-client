"use client";

import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/");

  if (isAuthPage) {
    return null;
  }

  return <Navbar />;
}
