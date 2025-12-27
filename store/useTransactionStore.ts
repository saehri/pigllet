import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { create } from "zustand";

type Store = {
  transactions: schema.Transaction[];
  hydrate: () => Promise<void>;
  isLoading: boolean;
};

export const useTransactionStore = create<Store>((set, get) => ({
  transactions: [],
  isLoading: false,
  hydrate: async () => {
    const relatedAccountsAlias = alias(schema.accounts, "related_accounts");

    const result = await db
      .select({
        transaction: {
          id: schema.transactions.id,
          amount: schema.transactions.amount,
          note: schema.transactions.note,
          account_id: schema.transactions.account_id,
          related_account_id: schema.transactions.related_account_id,
          category_id: schema.transactions.category_id,
          type: schema.transactions.type,
          image: schema.transactions.image,
          created_at: schema.transactions.created_at,
        },
        account: {
          id: schema.accounts.id,
          card_name: schema.accounts.card_name,
          card_number: schema.accounts.card_number,
          balance: schema.accounts.balance,
          is_default: schema.accounts.is_default,
          card_color: schema.accounts.card_color,
          created_at: schema.accounts.created_at,
        },
        category: {
          id: schema.categories.id,
          label: schema.categories.label,
          icon_name: schema.categories.icon_name,
          type: schema.categories.type,
        },
        related_account: {
          id: relatedAccountsAlias.id,
          card_name: relatedAccountsAlias.card_name,
          card_number: relatedAccountsAlias.card_number,
          balance: relatedAccountsAlias.balance,
          is_default: relatedAccountsAlias.is_default,
          card_color: relatedAccountsAlias.card_color,
          created_at: relatedAccountsAlias.created_at,
        },
      })
      .from(schema.transactions)
      .innerJoin(
        schema.categories,
        eq(schema.transactions.category_id, schema.categories.id),
      )
      .innerJoin(
        schema.accounts,
        eq(schema.transactions.account_id, schema.accounts.id),
      )
      .leftJoin(
        relatedAccountsAlias,
        eq(schema.transactions.related_account_id, relatedAccountsAlias.id),
      )
      .orderBy(desc(schema.transactions.created_at))
      .limit(20);

    set({ transactions: result as any, isLoading: false });
  },
}));
