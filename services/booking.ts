import axios from "axios";

import { API_PATH } from "./apiPath";

import { Seat } from "@/types";

export const getTripWithLocation = async (
  day: string,
  startLocation: string,
  endLocation: string,
) => {
  const response = await axios.get(`${API_PATH}/trips/`, {
    params: {
      day,
      startLocation,
      endLocation,
    },
    withCredentials: true,
  });

  return response.data;
};

export const getDetailTrip = async (tripId: string) => {
  const response = await axios.get(`${API_PATH}/trips/${tripId}`, {
    withCredentials: true,
  });

  return response.data;
};

export const requestNewTicket = async (
  userId: string,
  tripId: string,
  status: string,
  titleRequest: string,
  seats: Seat[],
  passengerName: string,
  passengerPhone: string,
  type: string,
  price: string,
) => {
  const response = await axios.post(
    `${API_PATH}/ticket-requests`,
    {
      userId,
      tripId,
      status,
      titleRequest,
      seats,
      passengerName,
      passengerPhone,
      type,
      price,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const cancelTicket = async (
  ticketId: string,
  titleRequest: string,
  seats: Seat[],
) => {
  const response = await axios.post(
    `${API_PATH}/ticket-requests/cancel-ticket`,
    {
      titleRequest,
      seats,
      ticketId,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const getAllRequest = async (params: any) => {
  const response = await axios.get(
    `${API_PATH}/ticket-requests/?status=Pending`,
    {
      params,
      withCredentials: true,
    },
  );

  return response.data;
};

export const cancelRequest = async (requestId: string) => {
  const response = await axios.delete(
    `${API_PATH}/ticket-requests/${requestId}`,
    {
      withCredentials: true,
    },
  );

  return response.data;
};
