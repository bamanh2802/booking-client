"use client";

import type { ThemeProviderProps } from "next-themes";

import { ToastProvider } from "@heroui/toast";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SocketProvider } from "@/contexts/SocketContext";
import { WebSocketNotifier } from "@/components/common/WebSocketNotifier";

import { AuthProvider } from "@/providers/AuthProvider";
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <SocketProvider>
        <AuthProvider>
          <NextThemesProvider {...themeProps}>
            <ToastProvider />
            {children}
            <WebSocketNotifier />
          </NextThemesProvider>
        </AuthProvider>
      </SocketProvider>
    </HeroUIProvider>
  );
}
