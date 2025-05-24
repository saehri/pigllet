import { useContext } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { Category, Account } from '@/db/schema';
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

export default function CreateIncomeForm() {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	// form state
	const [isLoading, setLoading] = useState(false);

	const [selectedCategory, setSelectedCategory] = useState<Category>();
	const [selectedAccount, setSelectedAccount] = useState<Account>();
	const [amount, setAmount] = useState<string>('');
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [note, setNote] = useState<string>('');
	const [image, setImage] = useState<string>('');

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [userAccounts, setUserAccounts] = useState<schema.Account[]>([]);
	const [userIncomeCategory, setUserIncomeCategories] = useState<
		schema.Category[]
	>([]);

	useEffect(() => {
		async function load() {
			try {
				const accounts = await drizzleDb.select().from(schema.accounts);
				const categories = await drizzleDb
					.select()
					.from(schema.categories)
					.where(eq(schema.categories.type, 'income'));

				setUserAccounts(accounts as Account[]);
				setSelectedAccount(accounts[0]);
				setSelectedCategory(categories[0]);
				setUserIncomeCategories(categories as Category[]);
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.CENTER);
			}
		}

		load();
	}, []);

	async function handleSubmit() {
		try {
			setLoading(true);

			if (!selectedAccount || !selectedCategory) return;

			if (!amount.length || isNaN(Number(amount))) {
				ToastAndroid.show('Please enter a valid amount', ToastAndroid.SHORT);
				return;
			}

			const payload: schema.Transaction = {
				amount: Number(amount),
				account_id: selectedAccount.id as number,
				category_id: selectedCategory.id as number,
				created_at: selectedDate.toISOString(),
				image,
				note,
				type: 'income',
			};

			await drizzleDb.insert(schema.transactions).values(payload);

			// also update the selected account balance
			await drizzleDb
				.update(schema.accounts)
				.set({
					balance: selectedAccount.balance + Number(amount),
				})
				.where(eq(schema.accounts.id, selectedAccount.id as number));

			ToastAndroid.show('Income record added!', ToastAndroid.CENTER);

			setAmount('');
			setNote('');
			setImage('');
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
					<Text style={styles.inputLabel} variant="bodyLarge">
						To account
					</Text>
					<AccountSelector
						accounts={userAccounts}
						handleSelect={setSelectedAccount}
						selectedAccount={selectedAccount}
					/>
				</View>

				<View style={{ gap: 8, flex: 1 }}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Amount ({currentCurrencySymbol})
					</Text>
					<TextInput
						keyboardType="number-pad"
						onChangeText={setAmount}
						value={amount}
						contentStyle={styles.inputContent}
					/>
				</View>
			</View>

			<View style={{ gap: 8 }}>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Expense category
				</Text>
				<SelectInputWithIcon
					data={userIncomeCategory}
					handleSelect={setSelectedCategory}
					selectedCategory={selectedCategory}
				/>
			</View>

			<View style={{ gap: 8 }}>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Date
				</Text>
				<DatePicker
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>
			</View>

			<View style={{ gap: 8 }}>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Note
				</Text>
				<TextInput
					contentStyle={styles.inputContent}
					onChangeText={setNote}
					value={note}
				/>
			</View>

			<View style={{ gap: 8 }}>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Add image
				</Text>
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
}

const styles = StyleSheet.create({
	inputLabel: {
		fontFamily: 'Inter-Regular',
	},
	inputContent: {
		fontFamily: 'Inter-Regular',
	},
});

