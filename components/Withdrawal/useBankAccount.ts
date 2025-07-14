import { useState, useEffect, useCallback } from "react";
import { getBankAccountByUserId } from "@/services/bank";
import { addToast } from "@heroui/toast";
import { BankAccountData } from "@/types";

export const useBankAccount = (userId?: string) => {
  const [bankAccount, setBankAccount] = useState<BankAccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccount = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const account = await getBankAccountByUserId(userId);
      setBankAccount(account.data);
    } catch (error) {
   
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return { bankAccount, setBankAccount, isLoading, refetch: fetchAccount };
};