import axios from "axios";

import { API_PATH } from "./apiPath";

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${API_PATH}/user/login`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const register = async (
  fullName: string,
  email: string,
  phone: string,
  password: string,
  referralCode: string
) => {
  const response = await axios.post(
    `${API_PATH}/user/register`,
    {
      email,
      password,
      fullName,
      phone,
      referralCode
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const logoutAuth = async () => {
  const response = await axios.delete(`${API_PATH}/user/logout`, {
    withCredentials: true,
  });

  return response.data;
};

export const getUserInfo = async () => {
  const response = await axios.get(`${API_PATH}/user/profile`, {
    withCredentials: true,
  });

  return response.data;
};
