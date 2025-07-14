import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type CalendarDate = {
  calendar: { identifier: string };
  era: string;
  year: number;
  month: number;
  day: number;
};

export interface Seat {
  code: string;
  floor: number;
}

export interface PaginatedTicketsResponse {
  results: Ticket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export type TicketRequestStatus =
  | "Pending"
  | "Confirmed"
  | "Rejected"
  | "Cancelled"
  | string;

export interface TicketRequest {
  _id: string;
  userId: string;
  amount: number;
  reason: string;
  tripId: string;
  titleRequest: string;
  ticketId: string | null;
  price: number;
  passengerName: string;
  passengerPhone: string;
  seats: Seat[];
  type: "Regular" | "VIP" | string;
  status: TicketRequestStatus;
  createdBy: string | null;
  pickupStation: string | null;
  dropoffStation: string | null;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string

  // Các đối tượng lồng nhau từ API
  tripInfo: TripInfo;
  carCompanyInfo: CarCompanyInfo;
  creatorInfo: CreatorInfo | null;
  creatorRole: CreatorRole | null;
}

export interface ClientUser {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
  roleName: "Agent1" | "Agent2" | "Client" | string;
  amount: number;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedRequestsResponse {
  results: TicketRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetMyTicketsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Ticket[];
}

export interface CreatorInfo {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
  amount: number;
  parentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorRole {
  _id: string;
  roleName: "Agent1" | "Agent2" | "Client" | string;
}

export interface Params {
  page?: number;
  limit?: number;
}
export interface TripInfo {
  _id: string;
  startTime: string; // ISO 8601 date string
  endTime: string; // ISO 8601 date string
  price: number;
  location: string;
  station: string;
  time: string; // Ví dụ: "5h30m"
  totalSeats: number;
  availableSeats: number;
  carCompanyId: string;
}

// Thông tin nhà xe, lồng trong vé
interface CarCompanyInfo {
  _id: string;
  name: string;
  hotline: string;
  type: string;
}
export type TicketStatus =
  | "Upcoming"
  | "Done"
  | "Cancelled"
  | "Confirmed"
  | string;
export interface Ticket {
  _id: string;
  userId: string;
  tripId: string;
  requestId: string;
  price: number;
  status: TicketStatus;
  passengerName: string;
  passengerPhone: string;
  seats: {
    code: string;
    floor: number;
  }[];
  type: "Regular" | "VIP" | string;
  createdBy: string | null;
  commissionPaid: boolean;
  pickupStation: string | null;
  dropoffStation: string | null;
  createdAt: string;
  updatedAt: string;

  // Các đối tượng lồng nhau từ API
  tripInfo: TripInfo;
  carCompanyInfo: CarCompanyInfo;
  creatorInfo: CreatorInfo | null;
  creatorRole?: CreatorRole | null; // Có thể có hoặc không
}

// Cấu trúc của response API
export interface PaginatedTicketsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    results: Ticket[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface PaginatedUsersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    results: ClientUser[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface AgentLv1DashboardStats extends AgentDashboardStats {
  totalChildAgents: number; // Tổng số Đại lý cấp 2
}

export interface ChildAgentPerformance {
  _id: string;
  name: string;
  totalUsers: number;
  ticketsSold: number;
  commission: number;
}
export interface AgentDashboardStats {
  totalUsers: number;

  ticketsThisMonth: number;

  totalCommission: number;
  pendingTickets: number;
}

export interface BookingRequest {
  _id: string;
  userId: string;
  tripId: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  passengerName: string;
  passengerPhone: string;
  seats: Seat[];
  price: number;
  createdAt: string;
  tripInfo: TripInfo;
  carCompanyInfo: CarCompanyInfo;
  titleRequest: string;
}
export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | string;
  user: string;
  action: string;
  isRead: boolean;
  targetType: string;
  targetId: string | null;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa cấu trúc response từ API
export interface PaginatedNotifications {
  results: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BankAccountData {
  _id: string;
  userId: string;
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
}
