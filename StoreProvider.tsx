"use client";
import { useRef, ReactNode } from "react";
import { Provider } from "react-redux";

import { makeStore, AppStore } from "./store";

interface StoreProviderProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // Tạo store instance
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
