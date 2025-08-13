import { useState } from 'react';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';

import { useRouter } from 'expo-router';
import { Keyboard, ToastAndroid } from 'react-native';

import * as schema from '@/db/schema';

export default function useAccountController() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const router = useRouter();

	// ------- form state
	const [loading, setLoading] = useState<boolean>(false);

	// ------ form input state
	const [accountName, setAccountName] = useState<string>(''); // Cast the accountBalance data type to number before submitting

	// ---------------------------- form functions
	async function createMainAccount() {
		try {
			Keyboard.dismiss();

			// Make sure that user set their account balance and it is a number
			if (!accountName.length)
				return ToastAndroid.show(
					'Please enter a valid account name!',
					ToastAndroid.SHORT
				);

			setLoading(true);

			await drizzleDb
				.insert(schema.accounts)
				.values({
					name: accountName,
					created_at: new Date().toISOString(),
					number: '',
					balance: 0,
					image: '',
					is_cash: 1,
				})
				.onConflictDoNothing();
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 1.5);
		}

		router.push('/(root)/(tabs)/home/month');
	}

	return {
		loading,
		setLoading,
		createMainAccount,
		accountName,
		setAccountName,
	};
}

