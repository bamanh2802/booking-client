// src/pages/agent/AgentDashboardPage.tsx

"use client";
import { useEffect, useState, useMemo } from "react";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import {
  UsersIcon,
  TicketIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

import { StatCard } from "./StatCard";
import { ReportChart } from "./ReportChart";

import { selectCurrentUser } from "@/store/slices/authSlice";
import { useAppSelector } from "@/lib/hook";
import { getUserList, getRevenue } from "@/services/agent";
interface ChartData {
  labels: string[];
  datasets: DataSet[];
}
interface DataSet {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  yAxisID?: "y" | "y1";
}
interface RevenueData {
  totalRevenue: number;
  totalTickets: number;
  chartData: {
    label: string;
    totalRevenue: number;
    totalTickets: number;
  }[];
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

interface UserData {
  results: User[];
  total: number;
}

const UserList = ({ users }: { users: User[] }) => {
  if (users.length === 0) {
    return <p className="text-gray-500">Chưa có người dùng nào đăng ký.</p>;
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user._id}
          className="flex items-center p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4 flex-grow">
            <p className="text-sm font-semibold text-gray-800">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <p className="text-xs text-gray-400">
            {new Date(user.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      ))}
    </div>
  );
};

// ----- Component chính: AgentDashboardPage -----
export default function AgentDashboardPage() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [revenueResponse, userResponse] = await Promise.all([
          getRevenue({ period: "7days" }),
          getUserList(),
        ]);

        if (revenueResponse?.success) {
          setRevenueData(revenueResponse.data);
        }
        if (userResponse?.success) {
          setUserData({
            results: userResponse.data.results,
            total: userResponse.data.pagination.total,
          });
        }
      } catch (error) {
        addToast({
          title: "Thông tin chưa hợp lệ",
          description: "Vui lòng điền đầy đủ các trường bắt buộc.",
          color: "danger",
        });
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  // `useMemo` tính toán dữ liệu cho biểu đồ, đã hoàn toàn tương thích với ReportChart mới
  const chartDataForComponent = useMemo(() => {
    if (!revenueData?.chartData) {
      return { labels: [], datasets: [] };
    }

    const labels = revenueData.chartData.map((item) =>
      new Date(item.label).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      })
    );

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu (VND)",
          data: revenueData.chartData.map((item) => item.totalRevenue),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          yAxisID: "y", // Trục y cho doanh thu
        },
        {
          label: "Số vé bán",
          data: revenueData.chartData.map((item) => item.totalTickets),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "y1", // Trục y1 cho số vé
        },
      ],
    };
  }, [revenueData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bảng điều khiển Đại lý</h1>
        <p className="text-gray-500">
          Tổng quan hoạt động kinh doanh của bạn trong 7 ngày qua.
        </p>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          color="text-indigo-500"
          icon={<UsersIcon className="h-8 w-8" />}
          title="Tổng người dùng"
          value={userData?.total ?? 0}
        />
        <StatCard
          color="text-green-500"
          icon={<TicketIcon className="h-8 w-8" />}
          title="Vé đã bán (7 ngày)"
          value={revenueData?.totalTickets ?? 0}
        />
        <StatCard
          color="text-blue-500"
          icon={<CreditCardIcon className="h-8 w-8" />}
          title="Doanh thu (7 ngày)"
          value={`${(revenueData?.totalRevenue ?? 0).toLocaleString("vi-VN")}đ`}
        />
      </div>

      {/* Biểu đồ và danh sách người dùng mới */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          {/* Truyền props đã được cập nhật */}
          <ReportChart
            chartData={chartDataForComponent as ChartData}
            subtitle="Dữ liệu trong 7 ngày gần nhất"
            title="Tổng quan Doanh thu & Số vé"
          />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold">Người dùng mới</h2>
          <UserList users={userData?.results ?? []} />
        </div>
      </div>
    </div>
  );
}
