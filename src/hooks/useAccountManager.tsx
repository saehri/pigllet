import { useRouter } from 'expo-router';
import { Keyboard, ToastAndroid } from 'react-native';
import { Dispatch, SetStateAction, useState } from 'react';
import moment from 'moment';

import { eq, inArray, or } from 'drizzle-orm';
import * as schema from '@/db/schema';

import { useUserFirstTimeStore } from '@/store/useUserFirstTimeStore';
import { useDrizzleDB } from './useDrizzleDb';

interface useAccountManager {
	loading: boolean;
	createMainAccount: () => void;
	createAccount: () => void;
	editAccount: (accountId: number) => void;
	deleteAccount: (accoundId: number) => void;
	accountName: string;
	accountHolder: string;
	accountNumber: string;
	cardColor: string;
	isDefault: number;
	setAccountName: Dispatch<SetStateAction<string>>;
	setAccountHolder: Dispatch<SetStateAction<string>>;
	setAccountNumber: Dispatch<SetStateAction<string>>;
	setCardColor: Dispatch<SetStateAction<string>>;
	setIsDefault: Dispatch<SetStateAction<number>>;
}

export default function useAccountManager(): useAccountManager {
	const drizzleDb = useDrizzleDB();
	const router = useRouter();
	const setFirstTimer = useUserFirstTimeStore((s) => s.setFirstTimer);

	// ------- form state
	const [loading, setLoading] = useState<boolean>(false);

	// ------ form input state
	const [accountName, setAccountName] = useState<string>('');
	const [accountHolder, setAccountHolder] = useState<string>('');
	const [accountNumber, setAccountNumber] = useState<string>('');
	const [cardColor, setCardColor] = useState<string>('#EA1C7E');
	const [isDefault, setIsDefault] = useState<number>(0);

	// ---------------------------- form functions
	async function createMainAccount() {
		try {
			Keyboard.dismiss();

			setLoading(true);

			const defaultAccounts = await drizzleDb
				.select()
				.from(schema.accounts)
				.where(eq(schema.accounts.is_default, 1));

			// proceed to create default account if there are no default account
			if (!defaultAccounts.length) {
				await drizzleDb
					.insert(schema.accounts)
					.values({
						card_name: accountName.trim(),
						card_holder: accountHolder.trim(),
						card_number: accountNumber.trim(),
						created_at: moment(new Date()).format('YYYY-MM-DD'),
						balance: 0,
						is_default: 1,
						card_color: cardColor,
					})
					.onConflictDoNothing();
			}

			setFirstTimer(false);
			router.push('/(root)/(tabs)/home/month');
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	}

	async function createAccount() {
		try {
			Keyboard.dismiss();

			setLoading(true);

			await drizzleDb
				.insert(schema.accounts)
				.values({
					card_name: accountName.trim(),
					card_holder: accountHolder.trim(),
					card_number: accountNumber.trim(),
					created_at: moment(new Date()).format('YYYY-MM-DD'),
					balance: 0,
					is_default: 0,
					card_color: cardColor,
				})
				.onConflictDoNothing();

			setAccountName('');
			setAccountHolder('');
			setAccountNumber('');
			ToastAndroid.show('Account created!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	}

	async function editAccount(selectedAccountId: number) {
		try {
			Keyboard.dismiss();

			setLoading(false);

			await drizzleDb
				.update(schema.accounts)
				.set({
					card_name: accountName.trim(),
					card_holder: accountHolder.trim(),
					card_number: accountNumber.trim(),
					card_color: cardColor,
				})
				.where(eq(schema.accounts.id, selectedAccountId));

			ToastAndroid.show('Account updated!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	}

	async function deleteAccount(selectedAccountId: number) {
		try {
			Keyboard.dismiss();

			setLoading(false);
			const selectedCard = await drizzleDb
				.select({ is_default: schema.accounts.is_default })
				.from(schema.accounts)
				.where(eq(schema.accounts.id, selectedAccountId));
			const isDefaultCard = Boolean(selectedCard[0].is_default);

			if (isDefaultCard) {
				return ToastAndroid.show(
					'Cannot delete main account!',
					ToastAndroid.SHORT
				);
			}

			await drizzleDb.transaction(async (tx) => {
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
								eq(schema.transactions.account_id, selectedAccountId),
								eq(schema.transactions.related_account_id, selectedAccountId)
							)
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
							transactionsToDelete.map((x) => x.id)
						)
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
									eq(schema.transactions.related_account_id, accountId)
								)
							);

						let balance = 0;

						for (const t of remainingTransactions) {
							if (t.type === 'income' && t.accountId === accountId) {
								balance += t.amount;
							} else if (t.type === 'expense' && t.accountId === accountId) {
								balance -= t.amount;
							} else if (t.type === 'transfer') {
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
					.where(eq(schema.accounts.id, selectedAccountId));
			});

			ToastAndroid.show('Account deleted!', ToastAndroid.SHORT);
			router.back();
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	}

	return {
		createMainAccount,
		createAccount,
		deleteAccount,
		editAccount,
		loading,
		cardColor,
		isDefault,
		accountName,
		accountHolder,
		accountNumber,
		setCardColor,
		setIsDefault,
		setAccountName,
		setAccountHolder,
		setAccountNumber,
	};
}

