import { db } from "@/db/db";
import { eq, inArray, or } from "drizzle-orm";
import { create } from "zustand";
import { ToastAndroid } from "react-native";
import * as schema from "@/db/schema";
import { useStatisticStore } from "./useStatisticStore";

type Store = {
  accounts: schema.Account[];
  isLoading: boolean;
  hydrate: () => Promise<void>;
  createAccount: (payload: schema.Account) => Promise<void>;
  editAccount: (payload: schema.Account) => Promise<void>;
  deleteAccount: (
    accountId: number,
    isDefaultAccount: boolean,
  ) => Promise<void>;
};

export const useAccountStore = create<Store>((set, get) => ({
  accounts: [],
  isLoading: false,
  hydrate: async () => {
    set({ isLoading: true });
    const { updateBalanceInAllAccounts } = useStatisticStore.getState();
    const result = await db.select().from(schema.accounts);
    const sumAccountsBalance = result.reduce(
      (acc, curr) => ({ balance: acc.balance + curr.balance }),
      { balance: 0 },
    );

    updateBalanceInAllAccounts(sumAccountsBalance.balance);

    set({ accounts: result, isLoading: false });
  },
  createAccount: async (payload) => {
    set({ isLoading: true });
    const prevState = get().accounts;

    try {
      const result = await db
        .insert(schema.accounts)
        .values({
          ...payload,
        })
        .returning();

      set({ accounts: [...result, ...get().accounts] });
    } catch (error: any) {
      set({ accounts: prevState });
      ToastAndroid.show("Failed to add new account", ToastAndroid.SHORT);
    }

    set({ isLoading: false });
  },
  editAccount: async (payload) => {
    const prevState = get().accounts;
    const newState = [
      payload,
      ...prevState.filter((acc) => acc.id != payload.id),
    ];
    set({ accounts: newState });

    try {
      await db
        .update(schema.accounts)
        .set(payload)
        .where(eq(schema.accounts.id, Number(payload.id)));
    } catch (error: any) {
      set({ accounts: prevState });
      ToastAndroid.show("Failed to edit account data", ToastAndroid.SHORT);
    }
  },
  deleteAccount: async (accountId, isDefaultAccount) => {
    const prevState = get().accounts;
    set({ accounts: prevState.filter((acc) => acc.id != accountId) });

    try {
      if (isDefaultAccount) throw new Error("Unable to remove default account");

      await db.transaction(async (tx) => {
        await tx.transaction(async (tx) => {
          // 1. Get all selected transactions before deleting them
          const transactionsToDelete = await tx
            .select({
              id: schema.transactions.id,
              type: schema.transactions.type,
              amount: schema.transactions.amount,
              accountId: schema.transactions.account_id,
              relatedAccountId: schema.transactions.related_account_id,
            })
            .from(schema.transactions)
            .where(
              or(
                eq(schema.transactions.account_id, accountId),
                eq(schema.transactions.related_account_id, accountId),
              ),
            );

          // 2. Get all affected account IDs
          const affectedAccountIds = new Set<number>();
          for (const t of transactionsToDelete) {
            if (t.accountId) affectedAccountIds.add(t.accountId);
            if (t.relatedAccountId) affectedAccountIds.add(t.relatedAccountId);
          }

          // 3. Delete all selected transactions at once
          await tx.delete(schema.transactions).where(
            inArray(
              schema.transactions.id,
              transactionsToDelete.map((x) => x.id),
            ),
          );

          // 4. Recalculate balances for affected accounts
          for (const accountId of affectedAccountIds) {
            const remainingTransactions = await tx
              .select({
                type: schema.transactions.type,
                amount: schema.transactions.amount,
                accountId: schema.transactions.account_id,
                relatedAccountId: schema.transactions.related_account_id,
              })
              .from(schema.transactions)
              .where(
                or(
                  eq(schema.transactions.account_id, accountId),
                  eq(schema.transactions.related_account_id, accountId),
                ),
              );

            let balance = 0;

            for (const t of remainingTransactions) {
              if (t.type === "income" && t.accountId === accountId) {
                balance += t.amount;
              } else if (t.type === "expense" && t.accountId === accountId) {
                balance -= t.amount;
              } else if (t.type === "transfer") {
                if (t.accountId === accountId) {
                  balance -= t.amount; // sent out
                } else if (t.relatedAccountId === accountId) {
                  balance += t.amount; // received
                }
              }
            }

            // 5. Update the account with the new balance
            await tx
              .update(schema.accounts)
              .set({ balance })
              .where(eq(schema.accounts.id, accountId));
          }
        });

        // delete the account
        await tx
          .delete(schema.accounts)
          .where(eq(schema.accounts.id, accountId));
      });
    } catch (error: any) {
      set({ accounts: prevState });
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  },
}));
