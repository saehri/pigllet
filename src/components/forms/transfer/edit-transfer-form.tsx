import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import {
	ActivityIndicator,
	Button,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';

import * as schema from '@/db/schema';
import { useContext, useEffect, useState } from 'react';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import { ToastAndroid } from 'react-native';
import { View } from 'lucide-react-native';
import { eq } from 'drizzle-orm';

import AccountSelector from '../account-selector';
import SelectInputWithIcon from '../select-input-with-icon';
import DatePicker from '../date-picker';
import ImageSelectorInput from '../image-select-input';
import { useLocalSearchParams } from 'expo-router';

export default function EditTransferForm() {
	const theme = useTheme();

	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;
	const { id } = useLocalSearchParams();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	// form state
	const [isLoading, setLoading] = useState(false);

	const [mainAccount, setMainAccount] = useState<schema.Account>();
	const [relatedAccount, setRelatedAccount] = useState<schema.Account>();
	const [selectedCategory, setSelectedCategory] = useState<schema.Category>();
	const [amount, setAmount] = useState<string>('');
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [note, setNote] = useState<string>('');
	const [image, setImage] = useState<string>('');

	const [userAccounts, setUserAccounts] = useState<schema.Account[]>([]);
	const [userTransferCategories, setUserTransferCategories] = useState<
		schema.Category[]
	>([]);

	useEffect(() => {
		async function load() {
			try {
				const data = await drizzleDb
					.select({
						transactions: schema.transactions,
						account: schema.accounts,
						category: schema.categories,
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

				const transferCategories = await drizzleDb
					.select()
					.from(schema.categories)
					.where(eq(schema.categories.type, 'transfer'));

				setUserAccounts(allAccounts as schema.Account[]);

				setMainAccount(data[0].account);

				setRelatedAccount(data[0].transactions);

				setUserTransferCategories(transferCategories as schema.Category[]);
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
				created_at: selectedDate.toISOString(),
				image,
				note,
			};

			await drizzleDb
				.insert(schema.transactions)
				.values(payload)
				.onConflictDoNothing();

			if (mainAccount.id !== relatedAccount.id) {
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
			}

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
					'Save changes'
				)}
			</Button>
		</View>
	);
}

