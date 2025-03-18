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
	initialFormValue?: schema.Income;
};

export default function NewIncomeForm({ initialFormValue }: Props) {
	const theme = useTheme();

	const [isLoading, setIsLoading] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(1);
	const [amount, setAmount] = useState(String(initialFormValue?.amount || ''));
	const [note, setNote] = useState(initialFormValue?.note || '');
	const [accountId, setAccountId] = useState(
		initialFormValue?.to_account_id || 1
	);

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { data: incomeCategories } = useLiveQuery(
		drizzleDb
			.select({
				id: schema.incomeCategories.id,
				icon_name: schema.incomeCategories.icon_name,
				label: schema.incomeCategories.label,
			})
			.from(schema.incomeCategories)
	);
	const { data: accounts } = useLiveQuery(
		drizzleDb.select().from(schema.accounts)
	);

	async function handleSubmit() {
		if (Number(amount)) {
			console.log({ selectedCategory, amount, note });
			ToastAndroid.show('Record saved', ToastAndroid.CENTER);
		} else {
			ToastAndroid.show('Invalid amount', ToastAndroid.CENTER);
		}
	}

	return (
		<View style={{ padding: 16, gap: 12 }}>
			<View style={{ flexDirection: 'row', gap: 16 }}>
				<View style={{ flex: 1, gap: 12 }}>
					<Text variant="bodyLarge">Category</Text>

					<SelectInputWithIcon
						selectedCategory={selectedCategory}
						data={incomeCategories}
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
