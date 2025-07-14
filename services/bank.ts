import axios from "axios";
import { API_PATH } from "./apiPath";


export const getBankAccountByUserId = async (userId: string) => {
  const response = await axios.get(`${API_PATH}/user/bank-account/${userId}`, {
    withCredentials: true,
  });

  return response.data;
}

export const createBankAccount = async (
  userId: string,
  accountNumber: string,
  bankName: string,
  accountHolderName: string
) => {
  const response = await axios.post(
    `${API_PATH}/user/bank-account`,
    {
      userId,
      accountNumber,
      bankName,
      accountHolderName,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export async function verifyBankAccount(bin: string, accountNumber: string) {
  const response = await axios.post("https://api.vietqr.io/v2/lookup", {
    bin,
    accountNumber,
  });

  if (response.data.code === "00") {
    return response.data.data.accountName;
  } else {
    throw new Error("Không xác minh được số tài khoản");
  }
}