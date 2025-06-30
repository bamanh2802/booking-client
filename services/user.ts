import axios from "axios";

import { API_PATH } from "./apiPath";

import { ClientUser } from "@/types";
export const getAgentUsers = async () => {
  const response = await axios.get(`${API_PATH}/admin/users`, {
    withCredentials: true,
  });

  return response.data;
};

// Hàm tạo User mới
export const createUser = async (
  email: string,
  password: string,
  fullName: string,
  phone: string,
  roleName: string,
): Promise<any> => {
  const response = await axios.post(
    `${API_PATH}/admin/users`,
    {
      email,
      password,
      fullName,
      phone,
      roleName,
    },
    {
      withCredentials: true,
    },
  );

  return response;
};

// Hàm cập nhật User
export const updateUser = async (
  userId: string,
  userData: Partial<ClientUser>,
): Promise<{ success: boolean }> => {
  console.log(`Updating user ${userId}:`, userData);

  // API call: PATCH /api/users/${userId}
  return Promise.resolve({ success: true });
};

// Hàm xóa User
export const deleteUser = async (
  userId: string,
): Promise<{ success: boolean }> => {
  console.log("Deleting user:", userId);

  // API call: DELETE /api/users/${userId}
  return Promise.resolve({ success: true });
};
