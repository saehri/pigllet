import { useRouter } from 'expo-router';
import { Keyboard, ToastAndroid } from 'react-native';
import { Dispatch, SetStateAction, useState } from 'react';
import moment from 'moment';

import { eq, or } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import { useUserFirstTimeStore } from '@/store/useUserFirstTimeStore';

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
	setAccountName: Dispatch<SetStateAction<string>>;
	setAccountHolder: Dispatch<SetStateAction<string>>;
	setAccountNumber: Dispatch<SetStateAction<string>>;
	setCardColor: Dispatch<SetStateAction<string>>;
}

export default function useAccountManager(): useAccountManager {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const router = useRouter();
	const setFirstTimer = useUserFirstTimeStore((s) => s.setFirstTimer);

	// ------- form state
	const [loading, setLoading] = useState<boolean>(false);

	// ------ form input state
	const [accountName, setAccountName] = useState<string>('');
	const [accountHolder, setAccountHolder] = useState<string>('');
	const [accountNumber, setAccountNumber] = useState<string>('');
	const [cardColor, setCardColor] = useState<string>('#EA1C7E');

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

			// delete all associated transactions
			await drizzleDb
				.delete(schema.transactions)
				.where(
					or(
						eq(schema.transactions.account_id, selectedAccountId),
						eq(schema.transactions.related_account_id, selectedAccountId)
					)
				);

			// delete the account
			await drizzleDb
				.delete(schema.accounts)
				.where(eq(schema.accounts.id, selectedAccountId));

			ToastAndroid.show('Account deleted!', ToastAndroid.SHORT);
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
		accountName,
		accountHolder,
		accountNumber,
		setCardColor,
		setAccountName,
		setAccountHolder,
		setAccountNumber,
	};
}

