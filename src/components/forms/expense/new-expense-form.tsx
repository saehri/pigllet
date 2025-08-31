import { useEffect } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';

import { useRecordExpenseForm } from '@/src/hooks/useTransactionsManager';
import { useCurrencyStyle } from '@/store/useCurrencyStyle';

import NoteInput from '../note-input';
import DatePicker from '../date-picker';
import AccountSelector from '../account-selector';
import CustomTextInput from '../custom-text-input';
import TransactionCategorySelector from '../transaction-category-selector';

export default function CreateExpenseForm() {
	const { currentCurrencyCode } = useCurrencyStyle();

	const {
		createExpenseRecord,
		loading,
		transactionAmount,
		selectedCategory,
		transactionDate,
		accountUsed,
		image,
		note,
		setNote,
		setImage,
		setAccountUsed,
		setTransactionDate,
		setSelectedCategory,
		setTransactionAmount,
		drizzleDb,
	} = useRecordExpenseForm();

	useEffect(() => {
		async function loadFormData() {
			const expenseCategories = await drizzleDb
				.select()
				.from(schema.categories)
				.where(eq(schema.categories.type, 'expense'));
			const accounts = await drizzleDb.select().from(schema.accounts);

			setSelectedCategory(expenseCategories[0]);
			setAccountUsed(accounts[0]);
		}

		loadFormData();
	}, []);

	return (
		<View style={styles.formWrapper}>
			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel} variant="bodyMedium">
					Transaction amount *
				</Text>

				<CustomTextInput
					keyboardType="number-pad"
					onChangeText={setTransactionAmount}
					value={transactionAmount}
					leftComponent={
						<Text
							style={{ fontFamily: 'Manrope-Regular' }}
							variant="labelMedium"
						>
							{currentCurrencyCode}
						</Text>
					}
					placeholder="6900"
				/>
			</View>

			<View style={styles.gridContainer}>
				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyMedium">
						Category *
					</Text>

					<TransactionCategorySelector
						transactionCategory="expense"
						selectedCategory={selectedCategory!}
						handleSelect={setSelectedCategory as any}
					/>
				</View>

				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyMedium">
						Transaction date *
					</Text>

					<DatePicker
						selectedDate={transactionDate}
						setSelectedDate={setTransactionDate}
					/>
				</View>
			</View>

			<View style={styles.inputContainerFull}>
				<Text style={styles.inputLabel} variant="bodyMedium">
					Account used *
				</Text>

				<AccountSelector
					selectedAccount={accountUsed!}
					handleSelect={setAccountUsed as any}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel} variant="bodyMedium">
					Note
				</Text>

				<NoteInput
					noteValue={note}
					setNoteValue={setNote}
					imageValue={image}
					setImageValue={setImage}
				/>
			</View>

			<Button
				mode="contained"
				style={styles.button}
				contentStyle={styles.buttonContent}
				labelStyle={styles.buttonLabel}
				onPress={createExpenseRecord}
				disabled={loading || !transactionAmount.length}
				loading={loading}
			>
				Save expense record
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	inputLabel: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
	},
	inputContent: {
		fontFamily: 'Manrope-Regular',
	},
	button: { borderRadius: 10, marginTop: 16 },
	buttonContent: {
		padding: 8,
	},
	buttonLabel: {
		fontFamily: 'Manrope-Medium',
		fontSize: 16,
	},
	inputContainer: {
		gap: 8,
	},
	inputContainerFull: {
		gap: 8,
		flex: 1,
	},
	gridContainer: {
		flexDirection: 'row',
		gap: 8,
	},
	formWrapper: {
		padding: 16,
		gap: 16,
	},
});

