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

import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import DatePicker from '../date-picker';
import Accountelector from '../account-selector';
import ImageSelectorInput from '../image-select-input';
import SelectInputWithIcon from '../select-input-with-icon';
import { StyleSheet } from 'react-native';

export default function CreateExpenseForm() {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	// form state
	const [isLoading, setLoading] = useState(false);

	const [selectedCategory, setSelectedCategory] = useState<schema.Category>();
	const [selectedAccount, setSelectedAccount] = useState<schema.Account>();
	const [amount, setAmount] = useState<string>('');
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [note, setNote] = useState<string>('');
	const [image, setImage] = useState<string>('');

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [userAccount, setUserAccount] = useState<schema.Account[]>([]);
	const [userExpenseCategories, setUserExpensesCategories] = useState<
		schema.Category[]
	>([]);

	useEffect(() => {
		async function load() {
			try {
				const Account = await drizzleDb.select().from(schema.accounts);
				const categories = await drizzleDb
					.select()
					.from(schema.categories)
					.where(eq(schema.categories.type, 'expense'));

				setUserAccount(Account as schema.Account[]);
				setSelectedAccount(Account[0]);
				setSelectedCategory(categories[0]);
				setUserExpensesCategories(categories as schema.Category[]);
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
				type: 'expense',
				account_id: selectedAccount.id as number,
				amount: Number(amount),
				category_id: selectedCategory.id as number,
				created_at: selectedDate.toISOString(),
				image,
				note,
			};

			await drizzleDb
				.insert(schema.transactions)
				.values(payload)
				.onConflictDoNothing();

			// also update the selected account balance
			await drizzleDb
				.update(schema.accounts)
				.set({
					balance: selectedAccount.balance - Number(amount),
				})
				.where(eq(schema.accounts.id, selectedAccount.id as number));

			ToastAndroid.show('Expense added!', ToastAndroid.CENTER);

			setAmount('');
			setNote('');
			setImage('');
		} catch (error) {
			ToastAndroid.show('Error adding expense', ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={{ padding: 16, gap: 16 }}>
			<View style={{ flexDirection: 'row', gap: 8 }}>
				<View style={{ gap: 8, flex: 1 }}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						From
					</Text>
					<Accountelector
						accounts={userAccount}
						handleSelect={setSelectedAccount}
						selectedAccount={selectedAccount!}
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
					data={userExpenseCategories}
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
					onChangeText={setNote}
					value={note}
					contentStyle={styles.inputContent}
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
					'Save expense record'
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

