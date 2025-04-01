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

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { TransactionCategories } from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import DatePicker from '../date-picker';
import AccountSelector from '../account-selector';
import ImageSelectorInput from '../image-select-input';
import SelectInputWithIcon from '../select-input-with-icon';

export default function NewTransferForm() {
	const theme = useTheme();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	// form state
	const [isLoading, setLoading] = useState(false);

	const [mainAccount, setMainAccount] = useState<schema.Accounts>();
	const [relatedAccount, setRelatedAccount] = useState<schema.Accounts>();
	const [selectedCategory, setSelectedCategory] =
		useState<schema.TransactionCategories>();
	const [amount, setAmount] = useState<string>('');
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [note, setNote] = useState<string>('');
	const [image, setImage] = useState<string>('');

	const [userAccounts, setUserAccounts] = useState<schema.Accounts[]>([]);
	const [userTransferCategories, setUserTransferCategories] = useState<
		schema.TransactionCategories[]
	>([]);

	useEffect(() => {
		async function load() {
			try {
				const accounts = await drizzleDb.select().from(schema.accounts);
				const transferCategories = await drizzleDb
					.select()
					.from(schema.categories)
					.where(eq(schema.categories.type, 'transfer'));

				setUserAccounts(accounts as schema.Accounts[]);
				setMainAccount(accounts[0]);
				setRelatedAccount(accounts[0]);

				setUserTransferCategories(
					transferCategories as TransactionCategories[]
				);
				setSelectedCategory(transferCategories[0]);
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.CENTER);
			}
		}

		load();
	}, []);

	async function handleSubmit() {
		try {
			setLoading(true);
			if (!mainAccount || !relatedAccount || !selectedCategory) return;

			// moved the payload into its own variable because the little shit keep screaming the types is invalid
			const payload: schema.Transaction = {
				type: 'transfer',
				amount: Number(amount),
				account_id: mainAccount.id as number,
				related_account_id: relatedAccount.id,
				category_id: selectedCategory.id as number,
				created_date: selectedDate.getDate(),
				created_month: selectedDate.getMonth() + 1,
				created_year: selectedDate.getFullYear(),
				image,
				note,
			};

			await drizzleDb
				.insert(schema.transactions)
				.values(payload)
				.onConflictDoNothing();

			// update the main account balance
			await drizzleDb
				.update(schema.accounts)
				.set({
					balance: mainAccount.balance - payload.amount,
				})
				.where(eq(schema.accounts.id, mainAccount.id as number));

			// update the related account balance
			await drizzleDb
				.update(schema.accounts)
				.set({
					balance: relatedAccount.balance + payload.amount,
				})
				.where(eq(schema.accounts.id, relatedAccount.id as number));

			ToastAndroid.show('Trasfer record added!', ToastAndroid.CENTER);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={{ padding: 16, gap: 16 }}>
			<View style={{ flexDirection: 'row', gap: 8 }}>
				<View style={{ gap: 8, flex: 1 }}>
					<Text variant="bodyLarge">From account</Text>
					<AccountSelector
						accounts={userAccounts}
						handleSelect={setMainAccount}
						selectedAccount={mainAccount!}
					/>
				</View>

				<View style={{ gap: 8, flex: 1 }}>
					<Text variant="bodyLarge">To account</Text>
					<AccountSelector
						accounts={userAccounts}
						handleSelect={setRelatedAccount}
						selectedAccount={relatedAccount!}
					/>
				</View>
			</View>

			<View style={{ gap: 8, flex: 1 }}>
				<Text variant="bodyLarge">Amount ({currentCurrencySymbol})</Text>
				<TextInput
					keyboardType="number-pad"
					onChangeText={setAmount}
					value={amount}
				/>
			</View>

			<View style={{ gap: 8 }}>
				<Text variant="bodyLarge">Transfer category</Text>
				<SelectInputWithIcon
					data={userTransferCategories}
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
					'Save transfer record'
				)}
			</Button>
		</View>
	);
}
