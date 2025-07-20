// src/pages/BookingPage.tsx

import { useState } from "react";
import { useRouter } from "next/navigation"; // FIX: Import useRouter để điều hướng
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button"; // FIX: Import Button để tạo nút đăng nhập

import StepHeader from "./StepHeader";
import SearchBar from "./SearchBar";
import BookingForm from "./BookingForm";
import { TripItem } from "./TripItem";
import { SeatMap } from "./SeatMap";
import { BookingSuccessModal, BookingDetails } from "./BookingSuccessModal";

import { getTripWithLocation, getDetailTrip } from "@/services/booking";
import { Seat } from "@/types";
import { TripItemData } from "@/types";

interface ApiTrip {
  _id: string;
  startLocation: string;
  endLocation: string;
  startStation: string;
  endStation: string;
  startTime: string;
  endTime: string;
  carCompanyId: string;
  seatMapId: string;
  price: number;
  type: string;
  totalSeats: number;
  availableSeats: number;
}

interface TripDetails {
  seatMap: Seat[];
  bookedSeats: Seat[];
}

const formatTime = (dateString: string): string => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return "";
  const diffMs = new Date(endTime).getTime() - new Date(startTime).getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffMinutes = Math.floor((diffMs % 3600000) / 60000);

  return `${diffHours} giờ ${diffMinutes} phút`;
};

interface BookingPageProps {
  onSearch?: () => void;
}

export default function BookingPage({ onSearch }: BookingPageProps) {
  const router = useRouter(); // FIX: Khởi tạo router

  const [step, setStep] = useState<"form" | "list">("form");
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [formData, setFormData] = useState<{
    origin: string;
    destination: string;
    time: string;
  } | null>(null);
  const [tripCount, setTripCount] = useState(0);
  const [selectedTripIndex, setSelectedTripIndex] = useState<number | null>(
    null
  );
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedTripDetails, setSelectedTripDetails] =
    useState<TripDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingDetails | null>(
    null
  );

  // FIX: Thêm state để lưu lỗi cụ thể khi tải chi tiết chuyến đi
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const resetBookingState = () => {
    // ... (logic giữ nguyên)
    setStep("form");
    setTrips([]);
    setFormData(null);
    setTripCount(0);
    setSelectedTripIndex(null);
    setSelectedSeats([]);
    setSelectedTripDetails(null);
    setBookingResult(null);
  };

  const handleBookingSuccess = (details: BookingDetails) => {
    setBookingResult(details);
  };

  const handleCloseModal = () => {
    resetBookingState();
  };

  const handleGetTrip = async (
    day: string,
    startLocation: string,
    endLocation: string
  ) => {
    // ... (logic giữ nguyên)
    setSelectedTripIndex(null);
    setSelectedTripDetails(null);
    setSelectedSeats([]);

    setFormData({ origin: startLocation, destination: endLocation, time: day });
    onSearch?.();
    try {
      const response = await getTripWithLocation(
        day,
        startLocation,
        endLocation
      );

      setTrips(response.data?.results || []);
      console.log(response.data?.results);
      setTripCount(response.data?.pagination?.total || 0);
    } catch (e) {
      console.error("Failed to fetch trips:", e);
      setTrips([]);
      setTripCount(0);
    }
    setStep("list");
  };

  const handleGetDetailTrip = async (tripId: string) => {
    setIsDetailsLoading(true);
    setDetailsError(null); // Reset lỗi trước mỗi lần gọi API
    try {
      const response = await getDetailTrip(tripId);

      if (response?.success && response.data) {
        setSelectedTripDetails({
          seatMap: response.data.carCompanyInfo.seatMap,
          bookedSeats: response.data.bookedSeats.seats,
        });
      } else {
        // Trường hợp API trả về success: false
        setSelectedTripDetails(null);
        setDetailsError("Không thể tải thông tin ghế. Dữ liệu không hợp lệ.");
      }
    } catch (e: any) {
      // FIX: Bắt lỗi một cách chi tiết
      console.error("Error fetching trip details:", e);
      setSelectedTripDetails(null);

      // FIX: Kiểm tra mã trạng thái của lỗi
      if (e.response && e.response.status === 401) {
        setDetailsError("Bạn cần đăng nhập để có thể chọn ghế và đặt vé.");
      } else {
        setDetailsError("Không thể tải thông tin ghế. Vui lòng thử lại sau.");
      }
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleTripSelect = (idx: number) => {
    const isClosing = selectedTripIndex === idx;

    setSelectedSeats([]);
    setSelectedTripDetails(null);
    setDetailsError(null); // FIX: Reset lỗi khi người dùng chọn chuyến khác

    if (isClosing) {
      setSelectedTripIndex(null);
    } else {
      setSelectedTripIndex(idx);
      const selectedTrip = trips[idx];
      handleGetDetailTrip(selectedTrip._id);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }) as typeof formData);
  };

  const handleSearch = () => {
    if (formData)
      handleGetTrip(formData.time, formData.origin, formData.destination);
  };

  return (
    <div
      className={`min-h-[calc(100vh-64px)] mt-[64px] overflow-y-auto py-6 px-4 ${step !== "form" ? "bg-slate-50 dark:bg-zinc-800" : ""}`}
    >
      {step === "form" && (
        <div className="max-w-4xl mx-auto">
          <BookingForm onSubmit={handleGetTrip} />
        </div>
      )}

      {step === "list" && (
        <div className="max-w-screen-xl mx-auto">
          <StepHeader currentStep={2} />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-4">
              <SearchBar
                date={formData?.time || ""}
                destination={formData?.destination || ""}
                origin={formData?.origin || ""}
                tripCount={tripCount}
                onChange={handleChange}
                onSearch={handleSearch}
              />
            </div>

            {/* Right Column: Trip Results */}
            <div className="lg:col-span-3">
              {trips.length > 0 ? (
                trips.map((trip, idx) => {
                  console.log("Rendering trip:", trip);
                  const tripDataForComponent: TripItemData = {
                    time: `${formatTime(trip.startTime)} - ${formatTime(trip.endTime)}`,
                    route: `${trip.startStation} → ${trip.endStation}`,
                    available: `${trip.availableSeats}/${trip.totalSeats} chỗ trống`,
                    price: trip.price.toLocaleString("vi-VN"),
                    type: trip.type,
                    pickup: "Điểm đón trả khách",
                    duration: calculateDuration(trip.startTime, trip.endTime),
                  };

                  return (
                    <div key={trip._id} className="mb-4">
                      <TripItem
                        isExpanded={selectedTripIndex === idx}
                        trip={tripDataForComponent}
                        onSelect={() => handleTripSelect(idx)}
                      />
                      {selectedTripIndex === idx && (
                        <Card className="mt-1 p-4 sm:p-6 shadow-lg border border-primary/20">
                          {isDetailsLoading && (
                            <div className="text-center p-8 text-gray-500">
                              Đang tải thông tin ghế...
                            </div>
                          )}
                          {!isDetailsLoading && selectedTripDetails && (
                            <>
                              <SeatMap
                                booked={selectedTripDetails.bookedSeats}
                                layout={selectedTripDetails.seatMap}
                                max={4}
                                price={selectedSeats.length * trip.price}
                                selected={selectedSeats}
                                tripId={trip._id}
                                tripType={trip.type}
                                onBookingSuccess={handleBookingSuccess}
                                onSelect={setSelectedSeats}
                              />
                              <Divider className="my-4" />
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div className="text-sm text-gray-700">
                                  Ghế đã chọn:{" "}
                                  <span className="font-bold text-primary">
                                    {selectedSeats
                                      .map(
                                        (s) =>
                                          `${s.code}${s.floor === 2 ? "(T2)" : ""}`
                                      )
                                      .join(", ") || "Chưa chọn ghế"}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-700">
                                  Tổng tiền:{" "}
                                  <span className="font-bold text-danger text-lg">
                                    {(
                                      selectedSeats.length * trip.price
                                    ).toLocaleString("vi-VN")}
                                    đ
                                  </span>
                                </div>
                              </div>
                            </>
                          )}

                          {/* FIX: Thay thế khối lỗi chung chung bằng khối lỗi động */}
                          {!isDetailsLoading && detailsError && (
                            <div className="text-center p-8 text-danger flex flex-col items-center gap-4">
                              <p className="font-semibold">{detailsError}</p>
                              {/* Hiển thị nút đăng nhập nếu là lỗi 401 */}
                              {detailsError.includes("đăng nhập") && (
                                <Button
                                  color="primary"
                                  onPress={() => router.push("/login")}
                                >
                                  Đi đến trang đăng nhập
                                </Button>
                              )}
                            </div>
                          )}
                        </Card>
                      )}
                    </div>
                  );
                })
              ) : (
                <Card className="p-10 text-center text-gray-500">
                  <h3 className="text-lg font-medium">
                    Không tìm thấy chuyến đi nào phù hợp
                  </h3>
                  <p className="mt-2 text-sm">
                    Vui lòng thử thay đổi ngày đi hoặc điểm đến/điểm đi.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
      <BookingSuccessModal
        bookingDetails={bookingResult}
        isOpen={!!bookingResult}
        onClose={handleCloseModal}
      />
    </div>
  );
}
