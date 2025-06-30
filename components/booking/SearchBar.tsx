// src/components/SearchBar.tsx

"use client";

import { useState } from "react";
import { MapPin, Search, ArrowRightLeft } from "lucide-react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/date-picker";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";

// --- Dữ liệu và Interfaces ---

// Sử dụng lại danh sách địa điểm từ BookingForm
const locations = [
  { id: 1, name: "Hà Nội", key: "HN" },
  { id: 2, name: "Nghệ An", key: "NA" },
  { id: 3, name: "Đà Nẵng", key: "DN" },
  { id: 4, name: "TP. Hồ Chí Minh", key: "HCM" },
];

interface SearchBarProps {
  origin: string;
  destination: string;
  date: string; // date là một string "YYYY-MM-DD"
  onChange: (field: string, value: string) => void;
  onSearch: () => void;
  tripCount: number;
}

// --- Component ---

export default function SearchBar({
  origin,
  destination,
  date,
  onChange,
  onSearch,
  tripCount,
}: SearchBarProps) {
  const [error, setError] = useState("");

  // Hàm hoán đổi vị trí, gọi lại hàm onChange của component cha
  const handleSwap = () => {
    onChange("origin", destination);
    onChange("destination", origin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Logic validation tương tự BookingForm
    if (!origin || !destination || !date) {
      setError("Vui lòng chọn đầy đủ thông tin.");

      return;
    }
    if (origin === destination) {
      setError("Điểm đi và điểm đến không được trùng nhau.");

      return;
    }

    // Nếu không có lỗi, thực hiện tìm kiếm
    onSearch();
  };

  // DatePicker cần một đối tượng DateValue, nên ta cần chuyển đổi chuỗi `date` từ props
  const selectedDateValue = date ? parseDate(date) : today(getLocalTimeZone());

  return (
    <Card>
      <CardBody className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Tìm kiếm chuyến đi
            </h3>
            <Chip color="primary" size="sm" variant="flat">
              {tripCount} Chuyến
            </Chip>
          </div>
          <Divider className="mb-4" />

          <div className="flex flex-col space-y-4">
            {/* ---- BỘ CHỌN ĐỊA ĐIỂM ---- */}
            <Select
              aria-label="Điểm đi"
              label="Điểm đi"
              selectedKeys={new Set([origin])}
              startContent={<MapPin className="text-default-400" size={18} />}
              variant="bordered"
              onSelectionChange={(keys) =>
                onChange("origin", Array.from(keys)[0] as string)
              }
            >
              {locations.map((loc) => (
                <SelectItem key={loc.key}>{loc.name}</SelectItem>
              ))}
            </Select>

            {/* Nút hoán đổi nhỏ gọn */}
            <div className="flex justify-center -my-2">
              <Button
                isIconOnly
                aria-label="Hoán đổi điểm đi và điểm đến"
                radius="full"
                size="sm"
                variant="light"
                onClick={handleSwap}
              >
                <ArrowRightLeft className="text-gray-500" size={16} />
              </Button>
            </div>

            <Select
              aria-label="Điểm đến"
              label="Điểm đến"
              selectedKeys={new Set([destination])}
              startContent={<MapPin className="text-default-400" size={18} />}
              variant="bordered"
              onSelectionChange={(keys) =>
                onChange("destination", Array.from(keys)[0] as string)
              }
            >
              {locations.map((loc) => (
                <SelectItem key={loc.key}>{loc.name}</SelectItem>
              ))}
            </Select>

            {/* ---- BỘ CHỌN NGÀY ---- */}
            <DatePicker
              showMonthAndYearPickers
              aria-label="Ngày đi"
              label="Ngày đi"
              minValue={today(getLocalTimeZone())}
              value={selectedDateValue}
              variant="bordered"
              onChange={(newDate) => {
                // Khi thay đổi, chuyển DateValue thành chuỗi và gọi hàm của cha
                if (newDate) {
                  onChange("time", newDate.toString());
                }
              }}
            />

            {/* Hiển thị lỗi nếu có */}
            {error && (
              <p className="text-danger text-sm font-medium -mt-2">{error}</p>
            )}

            <Button
              className="font-bold w-full"
              color="primary"
              endContent={<Search size={16} />}
              type="submit"
            >
              Tìm lại
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
