import { create } from "zustand";
import { db } from "@/db/db";
import * as schema from "@/db/schema";

type Store = {
  categories: schema.Category[];
  isLoading: boolean;
  hydrate: () => Promise<void>;
  addNewCategory: (payload: schema.Category[]) => Promise<void>;
};

export const useTransactionCategoryStore = create<Store>((set, get) => ({
  categories: [],
  isLoading: false,
  hydrate: async () => {
    set({ isLoading: true });

    const result = await db.select().from(schema.categories);

    set({ categories: result, isLoading: false });
  },
  addNewCategory: async (payload) => {
    const prevState = get().categories;
    set({ categories: [...payload, ...get().categories], isLoading: true });

    try {
      await db.insert(schema.categories).values(payload).onConflictDoNothing();
    } catch (error) {
      set({ categories: prevState });
    }

    set({ isLoading: false });
  },
}));
