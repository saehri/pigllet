import { create } from "zustand";

type LRUCacheTypes = Record<string, number>;

type Store = {
  averageDailySpendingInWeek: LRUCacheTypes;
  averageDailySpendingInMonth: LRUCacheTypes;
  averageDailySpendingInYear: LRUCacheTypes;
  balanceInAllAccounts: number;
  updateBalanceInAllAccounts: (value: number) => void;
};

export const useStatisticStore = create<Store>((set, get) => ({
  averageDailySpendingInWeek: {},
  averageDailySpendingInMonth: {},
  averageDailySpendingInYear: {},
  balanceInAllAccounts: 0,
  updateBalanceInAllAccounts: (balance) => {
    set({ balanceInAllAccounts: get().balanceInAllAccounts + balance });
  },
}));
