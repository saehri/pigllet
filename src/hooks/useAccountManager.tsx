import { useRouter } from 'expo-router';
import { Keyboard, ToastAndroid } from 'react-native';
import { Dispatch, SetStateAction, useState } from 'react';
import moment from 'moment';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import { useUserFirstTimeStore } from '@/store/useUserFirstTimeStore';

interface useAccountManager {
	loading: boolean;
	createMainAccount: () => void;
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

			// Make sure that user set their account balance and it is a number
			if (!accountName.length) {
				return ToastAndroid.show(
					"Account name can't be empty!",
					ToastAndroid.SHORT
				);
			}

			if (!accountHolder.length) {
				return ToastAndroid.show(
					"Account holder can't be empty!",
					ToastAndroid.SHORT
				);
			}

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

	return {
		createMainAccount,
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

