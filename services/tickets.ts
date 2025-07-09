import axios from "axios";

import { API_PATH } from "./apiPath";

import { Params } from "@/types";
export const getMyTickets = async (userId: string, params: Params) => {
  const response = await axios.get(`${API_PATH}/tickets/${userId}/list`, {
    params,
    withCredentials: true,
  });

  return response.data;
};

export const getTicketById = async(ticketId: string) => {
  const response = await axios.get(`${API_PATH}/tickets/${ticketId}`, {
    withCredentials: true
  })

  return response.data
}


export const getAllTickets = async (params?: Params) => {
  const response = await axios.get(`${API_PATH}/tickets`, {
    params,
    withCredentials: true,
  });

  return response.data;
};

export const updateRequestStatus = async (
  requestId: string,
  status: "Approved" | "Rejected",
): Promise<{ success: boolean }> => {
  console.log(`Updating request ${requestId} to status ${status}`);

  return Promise.resolve({ success: true });
};
