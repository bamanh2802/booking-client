import axios from "axios";

import { API_PATH } from "./apiPath";

import { Params } from "@/types";
export const getAllRequests = async (params?: Params) => {
  const response = await axios.get(`${API_PATH}/ticket-requests`, {
    params,
    withCredentials: true,
  });

  return response.data;
};

export const cancelTicket = async (
  ticketId: string,
): Promise<{ success: boolean }> => {
  console.log("Cancelling ticket:", ticketId);

  return Promise.resolve({ success: true });
};

// Hàm cập nhật trạng thái một yêu cầu
export const updateRequestStatus = async (
  requestId: string,
  status: "Approved" | "Rejected",
): Promise<{ success: boolean }> => {
  console.log(`Updating request ${requestId} to status ${status}`);

  return Promise.resolve({ success: true });
};
