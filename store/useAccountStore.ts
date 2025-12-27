import { create } from "zustand";
import { db } from "@/db/db";
import * as schema from "@/db/schema";

type Store = {
  accounts: schema.Account[];
  isLoading: boolean;
  hydrate: () => Promise<void>;
  createMainAccount: (payload: schema.Account) => Promise<void>;
};

export const useAccountStore = create<Store>((set, get) => ({
  accounts: [],
  isLoading: false,
  hydrate: async () => {
    set({ isLoading: true });

    const result = await db.select().from(schema.accounts);
    set({ accounts: result, isLoading: false });
  },
  createMainAccount: async (payload) => {
    set({ isLoading: true });

    await db.insert(schema.accounts).values({
      ...payload,
    });

    set({ isLoading: false });
  },
}));
