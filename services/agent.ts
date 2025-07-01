// ... các hàm getAgentUsers, createUser, etc. giữ nguyên ...
import axios from "axios";

import { API_PATH } from "./apiPath";

export const getUserList = async () => {
  const response = await axios.get(`${API_PATH}/admin/users`, {
    withCredentials: true,
  });

  return response.data;
};

export const getRevenue = async (params: any) => {
  const response = await axios.get(`${API_PATH}/admin/revenue`, {
    params,
    withCredentials: true,
  });

  return response.data;
};

export const getAgentCode = async () => {
  const response = await axios.get(`${API_PATH}/referral-codes/my-codes`, {
    withCredentials: true,
  });

  return response.data;
}

export const createAgentCode = async (code: string) => {
  const response = await axios.post(
    `${API_PATH}/referral-codes/generate`,
    { code },
    { withCredentials: true }
  );

  return response.data;
}
export const clientUseCode = async (code: string) => {
  const response = await axios.post(
    `${API_PATH}/referral-codes/use`,
    { code },
    { withCredentials: true }
  );

  return response.data;
}