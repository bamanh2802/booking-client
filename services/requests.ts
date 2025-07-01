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


export const createFastAction = async (
  phone: string,
  title: string
) => {
  const response = await axios.post(`${API_PATH}/quick-action`, {
    phone, title
  })
  return response.data
}

export const refundRequest = async (
  userId: string,
  amount: number,
  reason: string
) => {
  const response = await axios.post(
    `${API_PATH}/ticket-requests`,
    {
      userId,
      titleRequest: "Refund Ticket",
      amount,
      reason
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
};