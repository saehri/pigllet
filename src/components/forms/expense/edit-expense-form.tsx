import { useContext } from 'react';
import { useEffect, useState } from 'react';
import { ToastAndroid, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

import * as schema from '@/db/schema';
import { TransactionCategories, Accounts } from '@/db/schema';
import { eq } from 'drizzle-orm';

import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import AccountSelector from '../account-selector';
import SelectInputWithIcon from '../select-input-with-icon';
import DatePicker from '../date-picker';
import ImageSelectorInput from '../image-select-input';

export default function EditExpenseForm() {
	const theme = useTheme();
	const router = useRouter();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;
	const { id, type } = useLocalSearchParams();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [initialFormValue, setInitialFormValue] =
		useState<schema.Transaction>();
	const [userAccounts, setUserAccounts] = useState<schema.Accounts[]>([]);
	const [userExpenseCategories, setUserExpensesCategories] = useState<
		schema.TransactionCategories[]
	>([]);

	// form state
	const [isLoading, setLoading] = useState(false);

	const [selectedCategory, setSelectedCategory] =
		useState<TransactionCategories>();
	const [selectedAccount, setSelectedAccount] = useState<Accounts>();
	const [amount, setAmount] = useState<string>('');
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [note, setNote] = useState<string>('');
	const [image, setImage] = useState<string>('');

	useEffect(() => {
		async function load() {
			try {
				const data = await drizzleDb
					.select({
						transactions: schema.transactions,
						accounts: schema.accounts,
						categories: schema.categories,
					})
					.from(schema.transactions)
					.where(eq(schema.transactions.id, Number(id)))
					.innerJoin(
						schema.categories,
						eq(schema.transactions.category_id, schema.categories.id)
					)
					.innerJoin(
						schema.accounts,
						eq(schema.transactions.account_id, schema.accounts.id)
					);

				const allAccounts = await drizzleDb.select().from(schema.accounts);
				const allCategories = await drizzleDb
					.select()
					.from(schema.categories)
					.where(eq(schema.categories.type, type as string));

				const { accounts, categories, transactions } = data[0];

				setInitialFormValue(transactions);
				setSelectedAccount(accounts);
				setAmount(transactions.amount.toString());
				setSelectedCategory(categories);
				setSelectedDate(
					new Date(
						`${transactions.created_year}-${transactions.created_month}-${transactions.created_date}`
					)
				);
				setNote(transactions.note || '');
				setImage(transactions.image || '');

				setUserAccounts(allAccounts);
				setUserExpensesCategories(allCategories);
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.CENTER);
			}
		}

		load();
	}, []);

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
					created_month: selectedDate.getMonth() + 1,
					created_year: selectedDate.getFullYear(),
					image,
					note,
				})
				.where(eq(schema.transactions.id, initialFormValue.id as number));

			await drizzleDb
				.update(schema.accounts)
				.set({
					balance:
						initialAccount.balance - initialFormValue.amount + Number(amount),
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
					<ActivityIndicator size={20} color={theme.colors.onSurface} />
				) : (
					'Delete expense record'
				)}
			</Button>
		</View>
	);
}
