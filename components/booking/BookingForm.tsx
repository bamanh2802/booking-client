// src/components/BookingForm.tsx

"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/date-picker";
import { today, getLocalTimeZone, DateValue } from "@internationalized/date";

interface BookingFormProps {
  // Thay đổi signature để phù hợp với BookingPage
  onSubmit: (day: string, startLocation: string, endLocation: string) => void;
}

interface Location {
  id: number;
  name: string;
  key: string;
}

const locations: Location[] = [
  { id: 1, name: "Hà Nội", key: "HN" },
  { id: 2, name: "Nghệ An", key: "NA" },
  // Thêm các địa điểm khác nếu cần
  { id: 3, name: "Đà Nẵng", key: "DN" },
  { id: 4, name: "TP. Hồ Chí Minh", key: "HCM" },
];

export default function BookingForm({ onSubmit }: BookingFormProps) {
  // Sử dụng key thay vì toàn bộ object để quản lý state đơn giản hơn
  const [origin, setOrigin] = useState<string>("HN");
  const [destination, setDestination] = useState<string>("NA");
  const [selectedDate, setSelectedDate] = useState<DateValue>(
    today(getLocalTimeZone()),
  );
  const [error, setError] = useState("");

  const handleSwap = () => {
    const tempOrigin = origin;

    setOrigin(destination);
    setDestination(tempOrigin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!origin || !destination || !selectedDate) {
      setError("Vui lòng chọn đầy đủ thông tin.");

      return;
    }

    if (origin === destination) {
      setError("Điểm đi và điểm đến không được trùng nhau.");

      return;
    }

    onSubmit(selectedDate.toString(), origin, destination);
  };

  return (
    <Card className="max-w-4xl mx-auto mt-8 shadow-lg">
      <CardBody className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <Select
              aria-label="Điểm đi"
              className="w-full flex-1"
              label="Điểm đi"
              selectedKeys={new Set([origin])}
              variant="bordered"
              onSelectionChange={(keys) =>
                setOrigin(Array.from(keys)[0] as string)
              }
            >
              {locations.map((loc) => (
                <SelectItem key={loc.key}>{loc.name}</SelectItem>
              ))}
            </Select>

            <Button
              isIconOnly
              className="flex-shrink-0 transform md:rotate-0 rotate-90" // Xoay 90 độ trên mobile
              color="primary"
              radius="full"
              size="lg"
              title="Hoán đổi điểm đi/đến"
              type="button"
              variant="flat"
              onClick={handleSwap}
            >
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="12" x2="12" y1="5" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </Button>

            <Select
              aria-label="Điểm đến"
              className="w-full flex-1"
              label="Điểm đến"
              selectedKeys={new Set([destination])}
              variant="bordered"
              onSelectionChange={(keys) =>
                setDestination(Array.from(keys)[0] as string)
              }
            >
              {locations.map((loc) => (
                <SelectItem key={loc.key}>{loc.name}</SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <DatePicker
              showMonthAndYearPickers
              aria-label="Ngày đi"
              className="md:col-span-2"
              label="Ngày đi"
              minValue={today(getLocalTimeZone())}
              value={selectedDate}
              variant="bordered"
              onChange={setSelectedDate}
            />

            <Button
              className="font-semibold w-full h-[56px]"
              color="primary"
              size="lg"
              type="submit"
            >
              Tìm vé xe
            </Button>
          </div>

          {error && (
            <p className="text-danger text-sm font-medium mt-2">{error}</p>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
