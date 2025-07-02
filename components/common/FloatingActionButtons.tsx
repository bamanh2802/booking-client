"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { SiZalo } from "react-icons/si";
import { BsTelephoneFill } from "react-icons/bs";
import { MdReportProblem } from "react-icons/md";

// Thay thế bằng SĐT và link Zalo của bạn
const ZALO_LINK = "https://zalo.me/0975918797";
const PHONE_NUMBER = "tel:0388502397";

const FloatingActionButtons = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleComplaint = () => {
    alert("Chức năng khiếu nại đang được phát triển!");
  };

  return (
    <div className="fixed bottom-6 left-6 z-[99]">
      {/* Zalo Button với hiệu ứng đập đập */}
      <div
        className={`mb-4 transition-all duration-700 ease-out ${
          isVisible
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 -translate-x-8 scale-50"
        }`}
        style={{ animationDelay: "0.2s" }}
      >
        <div className="relative">
          {/* Ripple effects */}
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30"></div>
          <div className="absolute inset-0 rounded-full bg-blue-300 animate-ping opacity-20 animation-delay-500"></div>

          <Tooltip
            content="Chat qua Zalo"
            placement="right"
            classNames={{
              base: "py-2 px-4 shadow-xl text-black",
              content: "text-sm font-medium",
            }}
          >
            <Button
              as="a"
              href={ZALO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              isIconOnly
              className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce z-10"
              radius="full"
            >
              <SiZalo size={24} />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Phone Button với hiệu ứng lắc lắc */}
      <div
        className={`mb-4 transition-all duration-700 ease-out ${
          isVisible
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 -translate-x-8 scale-50"
        }`}
        style={{ animationDelay: "0.4s" }}
      >
        <div className="relative">
          {/* Ripple effects */}
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30"></div>
          <div className="absolute inset-0 rounded-full bg-green-300 animate-ping opacity-20 animation-delay-700"></div>

          <Tooltip
            content="Gọi điện thoại"
            placement="right"
            classNames={{
              base: "py-2 px-4 shadow-xl text-black",
              content: "text-sm font-medium",
            }}
          >
            <Button
              as="a"
              href={PHONE_NUMBER}
              isIconOnly
              className="relative w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-wiggle z-10"
              radius="full"
            >
              <BsTelephoneFill size={20} />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Complaint Button với hiệu ứng đập đập */}
      <div
        className={`mb-4 transition-all duration-700 ease-out ${
          isVisible
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 -translate-x-8 scale-50"
        }`}
        style={{ animationDelay: "0.6s" }}
      >
        <div className="relative">
          {/* Ripple effects */}
          <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30"></div>
          <div className="absolute inset-0 rounded-full bg-red-300 animate-ping opacity-20 animation-delay-1000"></div>

          <Tooltip
            content="Khiếu nại"
            placement="right"
            classNames={{
              base: "py-2 px-4 shadow-xl text-black",
              content: "text-sm font-medium",
            }}
          >
            <Button
              onClick={handleComplaint}
              isIconOnly
              className="relative w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse z-10"
              radius="full"
            >
              <MdReportProblem size={24} />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes wiggle {
          0%,
          7% {
            transform: rotateZ(0);
          }
          15% {
            transform: rotateZ(-15deg);
          }
          20% {
            transform: rotateZ(10deg);
          }
          25% {
            transform: rotateZ(-10deg);
          }
          30% {
            transform: rotateZ(6deg);
          }
          35% {
            transform: rotateZ(-4deg);
          }
          40%,
          100% {
            transform: rotateZ(0);
          }
        }

        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        /* Hiệu ứng đập mạnh hơn */
        @keyframes strongPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .animate-strong-pulse {
          animation: strongPulse 1.5s ease-in-out infinite;
        }

        /* Hiệu ứng bounce mạnh hơn */
        @keyframes strongBounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            transform: translate3d(0, -15px, 0);
          }
          70% {
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            transform: translate3d(0, -8px, 0);
          }
          90% {
            transform: translate3d(0, -3px, 0);
          }
        }

        .Button:nth-child(1) .animate-bounce {
          animation: strongBounce 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingActionButtons;
