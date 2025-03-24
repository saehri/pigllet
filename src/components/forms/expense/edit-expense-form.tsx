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
import { useRouter } from 'expo-router';

import * as schema from '@/db/schema';
import { TransactionCategories, Accounts } from '@/db/schema';
import { eq } from 'drizzle-orm';

import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import AccountSelector from '../account-selector';
import SelectInputWithIcon from '../select-input-with-icon';
import DatePicker from '../date-picker';
import ImageSelectorInput from '../image-select-input';

type Props = {
	initialFormValue: schema.Transaction;
	initialCategory: schema.TransactionCategories;
	initialAccount: schema.Accounts;
};

export default function EditExpenseForm({
	initialFormValue,
	initialCategory,
	initialAccount,
}: Props) {
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
					.where(eq(schema.categories.type, 'expense'));

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
			initialCategory={initialCategory}
			initialFormValue={initialFormValue}
			initialAccount={initialAccount}
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
	initialFormValue: schema.Transaction;
	initialCategory: schema.TransactionCategories;
	initialAccount: schema.Accounts;
};

const Form = memo(function Form({
	userAccounts,
	userExpenseCategories,
	drizzleDb,
	initialFormValue,
	initialCategory,
	initialAccount,
}: FormProps) {
	const theme = useTheme();
	const router = useRouter();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	// form state
	const [isLoading, setLoading] = useState(false);

	const [selectedCategory, setSelectedCategory] =
		useState<TransactionCategories>(initialCategory);
	const [selectedAccount, setSelectedAccount] =
		useState<Accounts>(initialAccount);
	const [amount, setAmount] = useState<string>(
		initialFormValue.amount.toString()
	);
	const [selectedDate, setSelectedDate] = useState<Date>(
		new Date(
			`${initialFormValue.created_year}-${initialFormValue.created_month}-${initialFormValue.created_date}`
		)
	);
	const [note, setNote] = useState<string>(initialFormValue.note || '');
	const [image, setImage] = useState<string>(initialFormValue.image || '');

	async function handleSubmit() {
		try {
			setLoading(true);

			if (!amount.length || isNaN(Number(amount))) {
				ToastAndroid.show('Please enter a valid amount', ToastAndroid.SHORT);
				return;
			}

			if (selectedAccount.balance - Number(amount) < 0) {
				ToastAndroid.show('Please enter a valid amount', ToastAndroid.SHORT);
				return;
			}

			await drizzleDb
				.update(schema.transactions)
				.set({
					type: 'expense',
					account_id: selectedAccount.id,
					amount: Number(amount),
					category_id: selectedCategory.id,
					created_date: selectedDate.getDate(),
					created_month: selectedDate.getMonth(),
					created_year: selectedDate.getFullYear(),
					image,
					note,
				})
				.where(eq(schema.transactions.id, initialFormValue.id as number));

			await drizzleDb
				.update(schema.accounts)
				.set({
					balance:
						initialAccount.balance + initialFormValue.amount - Number(amount),
				})
				.where(eq(schema.accounts.id, selectedAccount.id as number));

			ToastAndroid.show('Changes saved!', ToastAndroid.CENTER);
		} catch (error) {
			ToastAndroid.show('Error when updating expense', ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete() {
		try {
			setLoading(true);
			await drizzleDb
				.delete(schema.transactions)
				.where(eq(schema.transactions.id, initialFormValue.id as number));

			await drizzleDb
				.update(schema.accounts)
				.set({
					balance: initialAccount.balance + initialFormValue.amount,
				})
				.where(eq(schema.accounts.id, selectedAccount.id as number));

			ToastAndroid.show('Record deleted!', ToastAndroid.CENTER);
			router.back();
		} catch (error) {
			ToastAndroid.show('Error when updating expense', ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={{ padding: 16, gap: 16 }}>
			<View style={{ flexDirection: 'row', gap: 8 }}>
				<View style={{ gap: 8, flex: 1 }}>
					<Text variant="bodyLarge">From</Text>
					<AccountSelector
						accounts={userAccounts}
						handleSelect={setSelectedAccount}
						selectedAccount={selectedAccount}
					/>
				</View>

				<View style={{ gap: 8, flex: 1 }}>
					<Text variant="bodyLarge">Amount ({currentCurrencySymbol})</Text>

					<TextInput
						keyboardType="number-pad"
						onChangeText={setAmount}
						value={amount}
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
					'Save Changes'
				)}
			</Button>

			<Button
				mode="outlined"
				style={{ borderRadius: 10 }}
				labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
				onPress={handleDelete}
			>
				{isLoading ? (
					<ActivityIndicator size={20} color={theme.colors.onPrimary} />
				) : (
					'Delete Record'
				)}
			</Button>
		</View>
	);
});
