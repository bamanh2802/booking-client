"use client";

import React from "react";
import { Spinner } from "@heroui/spinner";

import { Logo } from "@/components/icons";

export const FullScreenLoader = () => {
  return (
    <div
      aria-label="Đang tải ứng dụng"
      className="
        fixed inset-0 z-50 
        flex flex-col items-center justify-center 
        bg-background/95 backdrop-blur-sm 
        transition-opacity duration-300 ease-in-out
      "
    >
      <div className="flex flex-col items-center gap-6">
  
  <img src="/assets/logo.png" alt="VeXeNay Logo" className="h-64 w-auto" />



        <Spinner
          color="primary"
          label="Đang khởi tạo..."
          labelColor="primary"
          size="lg"
        />
      </div>
    </div>
  );
};
