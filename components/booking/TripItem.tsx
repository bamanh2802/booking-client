import { Icon } from "@iconify/react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { TripItemData } from "@/types";

export function TripItem({
  trip,
  onSelect,
  isExpanded,
}: {
  trip: TripItemData;
  onSelect: () => void;
  isExpanded: boolean;
}) {
  return (
    <Card className="mb-4">
      <div className="block md:hidden p-4 space-y-3">
        <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
          <div className="flex items-center gap-2 text-blue-900 font-semibold">
            <Icon
              className="text-gray-500"
              height={18}
              icon="lucide:clock"
              width={18}
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold">{trip.time}</span>
              {trip.duration && (
                <div className="text-gray-400 text-xs">{trip.duration}</div>
              )}
            </div>
          </div>
          <div className="text-gray-700">
            <div className="font-medium text-sm mb-1">{trip.route}</div>
            {trip.pickup && (
              <div className="text-blue-500 text-xs flex items-center gap-1">
                <Icon height={14} icon="lucide:map-pin" width={14} />
                <span>{trip.pickup}</span>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Available + Type + Price + Button */}
        <div className="grid grid-cols-3 gap-2 items-center">
          <div className="text-center">
            <div className="text-green-700 font-semibold text-sm">
              {trip.available}
            </div>
            <div className="text-gray-400 text-xs">còn trống</div>
          </div>
          <div className="text-center">
            <Chip color="primary">{trip.type}</Chip>
          </div>
          <div className="text-center">
            <div className="text-red-600 font-bold text-sm mb-1">
              {trip.price}
            </div>
            <Button
              className="w-full"
              color={isExpanded ? "danger" : "primary"}
              size="sm"
              variant={isExpanded ? "flat" : "solid"}
              onPress={onSelect}
            >
              {isExpanded ? "Ẩn" : "Chọn"}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 items-center p-4">
        {/* Thời gian - 2 cột */}
        <div className="col-span-2 flex items-center gap-2 text-blue-900 font-semibold">
          <Icon
            className="text-gray-500 mr-[10px]"
            height={18}
            icon="lucide:clock"
            width={18}
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold">{trip.time}</span>
            {trip.duration && (
              <div className="text-gray-400 text-xs">{trip.duration}</div>
            )}
          </div>
        </div>

        <div className="col-span-4 text-gray-700">
          <div className="font-medium text-base mb-1">{trip.route}</div>
          {trip.pickup && (
            <div className="text-blue-500 text-xs flex items-center gap-1">
              <Icon height={14} icon="lucide:map-pin" width={14} />
              <span>{trip.pickup}</span>
            </div>
          )}
        </div>

        {/* Còn trống - 2 cột */}
        <div className="col-span-2 text-center">
          <div className="text-green-700 font-semibold text-base">
            {trip.available}
          </div>
        </div>

        {/* Loại chuyến - 2 cột */}
        <div className="col-span-2 text-center">
          <div className="text-gray-500 text-sm italic bg-gray-100 px-3 py-1 rounded-full">
            {trip.type}
          </div>
        </div>

        {/* Giá + Nút chọn - 2 cột */}
        <div className="col-span-2 flex flex-col items-center gap-2">
          <div className="text-red-600 font-bold text-lg">{trip.price}</div>
          <Button
            color={isExpanded ? "danger" : "primary"}
            variant={isExpanded ? "flat" : "solid"}
            onPress={onSelect}
          >
            {isExpanded ? "Ẩn" : "Chọn chỗ"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
