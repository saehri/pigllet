import { memo, useContext } from 'react';
import { useEffect, useState } from 'react';
import { Dimensions, ToastAndroid, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { TransactionCategories, Accounts } from '@/db/schema';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import DatePicker from '../date-picker';
import AccountSelector from '../account-selector';
import ImageSelectorInput from '../image-select-input';
import SelectInputWithIcon from '../select-input-with-icon';

export default function CreateIncomeForm() {
	const theme = useTheme();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [userAccounts, setUserAccounts] = useState<schema.Accounts[]>([]);
	const [userExpenseCategories, setUserExpensesCategories] = useState<
		schema.TransactionCategories[]
	>([]);

	useEffect(() => {
		async function load() {
			try {
				const accounts = await drizzleDb.select().from(schema.accounts);
				const categories = await drizzleDb
					.select()
					.from(schema.categories)
					.where(eq(schema.categories.type, 'incomes'));

				setUserAccounts(accounts as Accounts[]);
				setUserExpensesCategories(categories as TransactionCategories[]);
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.CENTER);
			}
		}

		load();
	}, []);

	if (!userAccounts.length || !userExpenseCategories.length) {
		return (
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					height: Dimensions.get('screen').height - 150,
				}}
			>
				<ActivityIndicator size={20} color={theme.colors.onSurface} />
			</View>
		);
	}

	return (
		<Form
			userAccounts={userAccounts}
			userExpenseCategories={userExpenseCategories}
			drizzleDb={drizzleDb}
		/>
	);
}

type FormProps = {
	userExpenseCategories: TransactionCategories[];
	userAccounts: Accounts[];
	drizzleDb: ExpoSQLiteDatabase<typeof schema> & {
		$client: SQLiteDatabase;
	};
};

const Form = memo(function Form({
	userAccounts,
	userExpenseCategories,
	drizzleDb,
}: FormProps) {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	// form state
	const [isLoading, setLoading] = useState(false);

	const [selectedCategory, setSelectedCategory] =
		useState<TransactionCategories>(userExpenseCategories[0]);
	const [selectedAccount, setSelectedAccount] = useState<Accounts>(
		userAccounts[0]
	);
	const [amount, setAmount] = useState<string>('');
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [note, setNote] = useState<string>('');
	const [image, setImage] = useState<string>('');

	async function handleSubmit() {
		try {
			setLoading(true);

			if (!amount.length || isNaN(Number(amount))) {
				ToastAndroid.show('Please enter a valid amount', ToastAndroid.SHORT);
				return;
			}

			await drizzleDb
				.insert(schema.transactions)
				.values({
					type: 'incomes',
					account_id: selectedAccount.id,
					amount: Number(amount),
					related_account_id: selectedAccount.id,
					category_id: selectedCategory.id,
					created_date: selectedDate.getDate(),
					created_month: selectedDate.getMonth() + 1,
					created_year: selectedDate.getFullYear(),
					image,
					note,
				})
				.onConflictDoNothing();

			// also update the selected account balance
			await drizzleDb
				.update(schema.accounts)
				.set({
					balance: selectedAccount.balance + Number(amount),
				})
				.where(eq(schema.accounts.id, selectedAccount.id as number));

			ToastAndroid.show('Income record added!', ToastAndroid.CENTER);
		} catch (error) {
			ToastAndroid.show('Error adding income record', ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={{ padding: 16, gap: 16 }}>
			<View style={{ flexDirection: 'row', gap: 8 }}>
				<View style={{ gap: 8, flex: 1 }}>
					<Text variant="bodyLarge">Amount ({currentCurrencySymbol})</Text>
					<TextInput
						keyboardType="number-pad"
						onChangeText={setAmount}
						value={amount}
					/>
				</View>

				<View style={{ gap: 8, flex: 1 }}>
					<Text variant="bodyLarge">To account</Text>
					<AccountSelector
						accounts={userAccounts}
						handleSelect={setSelectedAccount}
						selectedAccount={selectedAccount}
					/>
				</View>
			</View>

			<View style={{ gap: 8 }}>
				<Text variant="bodyLarge">Expense category</Text>
				<SelectInputWithIcon
					data={userExpenseCategories}
					handleSelect={setSelectedCategory}
					selectedCategory={selectedCategory}
				/>
			</View>

			<View style={{ gap: 8 }}>
				<Text variant="bodyLarge">Date</Text>
				<DatePicker
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>
			</View>

			<View style={{ gap: 8 }}>
				<Text variant="bodyLarge">Note</Text>
				<TextInput onChangeText={setNote} value={note} />
			</View>

			<View style={{ gap: 8 }}>
				<Text variant="bodyLarge">Add image</Text>
				<ImageSelectorInput handleSelect={setImage} selectedImage={image} />
			</View>

			<Button
				mode="contained"
				style={{ borderRadius: 10, marginTop: 16 }}
				labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
				onPress={handleSubmit}
				disabled={!amount.length}
			>
				{isLoading ? (
					<ActivityIndicator size={20} color={theme.colors.onPrimary} />
				) : (
					'Save income record'
				)}
			</Button>
		</View>
	);
});
