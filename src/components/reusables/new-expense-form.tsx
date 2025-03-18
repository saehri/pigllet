import { useState } from 'react';
import { ToastAndroid, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';

import * as schema from '@/db/schema';

import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import SelectInputWithIcon from '../forms/select-input-with-icon';
import AccountSelector from '../forms/account-selector';

type Props = {
	initialFormValue?: schema.Expense;
};

export default function NewExpenseForm({ initialFormValue }: Props) {
	const theme = useTheme();
	const [isLoading, setLoading] = useState(false);

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { data: expenseCategories } = useLiveQuery(
		drizzleDb.select().from(schema.expenseCategories)
	);
	const { data: accounts } = useLiveQuery(
		drizzleDb.select().from(schema.accounts)
	);

	const [selectedCategory, setSelectedCategory] = useState(1);
	const [accountId, setAccountId] = useState(1);
	const [amount, setAmount] = useState(String(initialFormValue?.amount || ''));
	const [note, setNote] = useState(initialFormValue?.note || '');

	async function handleSubmit() {
		try {
			if (!amount.length || !Boolean(Number(amount)))
				return ToastAndroid.show(
					'Please enter a valid amount',
					ToastAndroid.SHORT
				);

			setLoading(true);

			const createdAt = new Date();

			await drizzleDb.insert(schema.expenses).values({
				account_id: accountId,
				amount: Number(amount),
				category_id: selectedCategory,
				created_date: createdAt.toISOString(),
				note: note,
				budget_id: null,
				created_day: createdAt.getDay(),
				created_month: createdAt.getMonth(),
				created_year: createdAt.getFullYear(),
			});

			ToastAndroid.show('Record saved', ToastAndroid.CENTER);
		} catch (error) {
			ToastAndroid.show('Invalid amount', ToastAndroid.CENTER);
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 800);
		}
	}

	return (
		<View style={{ padding: 16, gap: 12 }}>
			<View style={{ flexDirection: 'row', gap: 16 }}>
				<View style={{ flex: 1, gap: 12 }}>
					<Text variant="bodyLarge">Category</Text>

					<SelectInputWithIcon
						selectedCategory={selectedCategory}
						data={expenseCategories}
						handleSelect={setSelectedCategory}
					/>
				</View>

				<View style={{ flex: 1, gap: 12 }}>
					<Text variant="bodyLarge" style={{ fontFamily: 'Inter-Regular' }}>
						Amount
					</Text>

					<TextInput
						keyboardType="number-pad"
						contentStyle={{ fontFamily: 'Inter-Regular' }}
						onChangeText={setAmount}
						value={amount}
					/>
				</View>
			</View>

			<View style={{ flex: 1, gap: 12 }}>
				<Text variant="bodyLarge">From</Text>

				<AccountSelector
					accounts={accounts}
					handleSelect={setAccountId}
					selectedAccount={accountId}
				/>
			</View>

			<View style={{ gap: 12, marginBottom: 24 }}>
				<Text variant="bodyLarge">Note</Text>
				<TextInput
					contentStyle={{ fontFamily: 'Inter-Regular' }}
					onChangeText={setNote}
					value={note}
				/>
			</View>

			<Button
				mode="contained"
				onPress={handleSubmit}
				disabled={!amount.length}
				labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
				style={{ borderRadius: 10 }}
			>
				{isLoading ? (
					<ActivityIndicator size={20} color={theme.colors.onPrimary} />
				) : (
					'Save record'
				)}
			</Button>
		</View>
	);
}
