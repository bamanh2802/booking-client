// src/components/LoanSupport.tsx

"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { createFastAction } from "@/services/requests";

import { MdLocationOn, MdPhone, MdSend, MdClose } from "react-icons/md";
import { FaMoneyBillWave, FaHandshake } from "react-icons/fa";

type Region = "Miền Bắc" | "Miền Trung" | "Miền Nam" | null;

const LoanSupport = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRegion, setSelectedRegion] = useState<Region>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const regionData = {
    "Miền Bắc": {
      color: "primary",
      gradient: "from-blue-500 to-purple-600",
      icon: "🏔️",
      cities: "Hà Nội, Hải Phòng, Quảng Ninh...",
    },
    "Miền Trung": {
      color: "warning",
      gradient: "from-orange-500 to-red-500",
      icon: "🏖️",
      cities: "Đà Nẵng, Huế, Hội An...",
    },
    "Miền Nam": {
      color: "success",
      gradient: "from-green-500 to-teal-500",
      icon: "🌴",
      cities: "TP.HCM, Cần Thơ, Vũng Tàu...",
    },
  };

  const openModal = (region: Region) => {
    setSelectedRegion(region);
    setPhoneNumber("");
    setFormError(null);
    onOpen();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim() || !/^\d{10,11}$/.test(phoneNumber)) {
      setFormError("Vui lòng nhập số điện thoại hợp lệ (10-11 số).");
      return;
    }
    setFormError(null);

    setIsLoading(true);
    try {
      await createFastAction(phoneNumber, `Quick Loan`);

      addToast({
        title: "Yêu cầu đã được gửi!",
        description: `Chuyên viên tư vấn cho khu vực ${selectedRegion} sẽ sớm liên hệ với bạn.`,
        color: "success",
      });

      onOpenChange();
    } catch (e) {
      console.error(e);
      addToast({
        title: "Gửi yêu cầu thất bại",
        description: "Đã có lỗi xảy ra từ máy chủ. Vui lòng thử lại sau.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (formError) {
      setFormError(null);
    }
  };

  return (
    <>
      <div className="fixed top-1/2 -translate-y-1/2 right-6 flex flex-col items-end space-y-3 z-[99]">
        {isPanelVisible ? (
          <>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-gray-200/50 hover:bg-red-500/80 hover:text-white backdrop-blur-sm"
              onClick={() => setIsPanelVisible(false)}
              aria-label="Ẩn hỗ trợ vay"
            >
              <MdClose size={18} />
            </Button>
            {(Object.keys(regionData) as Region[]).map((region, index) => (
              <div
                key={region}
                className="relative group animate-fade-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    regionData[region!].gradient
                  } rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-pulse`}
                />
                <Card className="relative overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:scale-105 transition-all duration-300 min-w-[180px]">
                  <CardBody className="p-0">
                    <Button
                      onClick={() => openModal(region)}
                      className={`w-full h-auto p-4 bg-gradient-to-r ${
                        regionData[region!].gradient
                      } text-white font-bold text-sm shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl border-0`}
                      size="lg"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-2">
                          <FaMoneyBillWave size={20} />
                          <MdLocationOn size={18} />
                        </div>
                        <div className="text-center leading-tight">
                          <div className="text-xs opacity-90">Hỗ trợ vay</div>
                          <div className="font-extrabold text-base">
                            {region}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </CardBody>
                </Card>
                <Chip
                  size="sm"
                  className="absolute -top-2 -right-2 bg-red-500 text-white font-bold animate-bounce"
                >
                  HOT
                </Chip>
              </div>
            ))}
          </>
        ) : (
          <Button
            isIconOnly
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg animate-pulse"
            onClick={() => setIsPanelVisible(true)}
            aria-label="Hiện hỗ trợ vay"
          >
            <FaMoneyBillWave size={20} />
          </Button>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-black/80 to-black/40 backdrop-blur-sm",
          base: "border-0 bg-gradient-to-br from-white to-blue-50/50",
          header: "border-b-[1px] border-gray-200",
          body: "py-6",
          closeButton:
            "hover:bg-red-500/20 text-red-500 border-red-200 hover:text-white transition-all duration-200",
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              scale: 0.95,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    selectedRegion ? regionData[selectedRegion].gradient : ""
                  } opacity-10`}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <FaHandshake className="text-3xl text-blue-600" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Tư vấn vay vốn
                    </h2>
                  </div>
                  <Chip
                    size="lg"
                    className={`bg-gradient-to-r ${
                      selectedRegion ? regionData[selectedRegion].gradient : ""
                    } text-white font-bold`}
                  >
                    📍 {selectedRegion}{" "}
                    {selectedRegion ? regionData[selectedRegion].icon : ""}
                  </Chip>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-xl">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      🎯 Ưu đãi đặc biệt khu vực {selectedRegion}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        • Lãi suất ưu đãi chỉ từ{" "}
                        <span className="font-bold text-red-500">Tốt</span>
                      </p>
                      <p>
                        • Giải ngân nhanh trong{" "}
                        <span className="font-bold text-green-600">
                          30 phút
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-base">
                    💬 Để lại số điện thoại, chuyên viên tư vấn sẽ gọi lại cho
                    bạn trong{" "}
                    <span className="font-bold text-blue-600">15 phút</span>
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onValueChange={handlePhoneChange}
                      placeholder="Nhập số điện thoại của bạn"
                      startContent={<MdPhone className="text-gray-400" />}
                      size="lg"
                      isInvalid={!!formError}
                      errorMessage={formError}
                      classNames={{
                        input: "text-lg",
                        inputWrapper:
                          "border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500 shadow-sm",
                      }}
                      isRequired
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className={`w-full font-bold text-lg py-3 bg-gradient-to-r ${
                        selectedRegion
                          ? regionData[selectedRegion].gradient
                          : ""
                      } text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
                      startContent={!isLoading && <MdSend size={20} />}
                      isLoading={isLoading}
                    >
                      {!isLoading && "🚀 Gửi yêu cầu ngay"}
                    </Button>
                  </form>
                </div>
              </ModalBody>
              <ModalFooter className="justify-center border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  🔒 Thông tin của bạn được bảo mật tuyệt đối
                </p>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoanSupport;
