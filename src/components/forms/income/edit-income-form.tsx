import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

import { and, eq } from 'drizzle-orm';
import * as schema from '@/db/schema';

import { useRecordIncomeForm } from '@/src/hooks/useTransactionsManager';
import { useCurrencyStyle } from '@/store/useCurrencyStyle';

import NoteInput from '../note-input';
import DatePicker from '../date-picker';
import AccountSelector from '../account-selector';
import CustomTextInput from '../custom-text-input';
import TransactionCategorySelector from '../transaction-category-selector';

export default function EditIncomeForm() {
	const { currentCurrencyCode } = useCurrencyStyle();
	const { id } = useLocalSearchParams();

	const {
		loading,
		note,
		image,
		drizzleDb,
		accountUsed,
		transactionDate,
		selectedCategory,
		transactionAmount,
		setNote,
		setImage,
		setAccountUsed,
		setSelectedCategory,
		setTransactionAmount,
		setTransactionDate,
		updateIncomeRecord,
	} = useRecordIncomeForm();

	useEffect(() => {
		async function loadFormData() {
			const formData = await drizzleDb
				.select()
				.from(schema.transactions)
				.where(
					and(
						eq(schema.transactions.id, Number(id)),
						eq(schema.transactions.type, 'income')
					)
				)
				.leftJoin(
					schema.categories,
					eq(schema.categories.id, schema.transactions.category_id)
				)
				.leftJoin(
					schema.accounts,
					eq(schema.accounts.id, schema.transactions.account_id)
				);

			const { accounts, categories, transactions } = formData[0];
			setTransactionAmount(transactions?.amount.toString()!);
			setSelectedCategory(categories!);
			setTransactionDate(new Date(transactions?.created_at!));
			setAccountUsed(accounts!);
			setNote(transactions?.note!);
			setImage(transactions?.image!);
		}

		loadFormData();
	}, []);

	return (
		<View style={styles.formWrapper}>
			<View style={styles.inputContainerFull}>
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
						transactionCategory="income"
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

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel} variant="bodyMedium">
					Destination account *
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
				labelStyle={styles.buttonLabel}
				onPress={() => updateIncomeRecord(Number(id))}
				disabled={loading || !transactionAmount.length}
				loading={loading}
			>
				Save changes
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	inputLabel: {
		fontFamily: 'Manrope-Regular',
	},
	inputContent: {
		fontFamily: 'Manrope-Regular',
	},
	button: { borderRadius: 10, marginTop: 16, padding: 8 },
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

