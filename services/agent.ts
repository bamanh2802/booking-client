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
