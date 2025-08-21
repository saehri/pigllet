import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

import { and, eq } from 'drizzle-orm';
import * as schema from '@/db/schema';

import { useRecordTransferForm } from '@/src/hooks/useTransactionsManager';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

import NoteInput from '../note-input';
import DatePicker from '../date-picker';
import CustomTextInput from '../custom-text-input';
import TransactionCategorySelector from '../transaction-category-selector';

export default function EditTransferForm() {
	const { currentCurrencyCode } = usePreferredCurrencyStore();
	const { id } = useLocalSearchParams();

	const {
		updateTransferRecord,
		image,
		drizzleDb,
		loading,
		note,
		selectedCategory,
		setImage,
		setNote,
		setSelectedCategory,
		setTransactionAmount,
		setTransactionDate,
		transactionAmount,
		transactionDate,
	} = useRecordTransferForm();

	useEffect(() => {
		async function loadFormData() {
			const formData = await drizzleDb
				.select()
				.from(schema.transactions)
				.where(
					and(
						eq(schema.transactions.id, Number(id)),
						eq(schema.transactions.type, 'transfer')
					)
				)
				.leftJoin(
					schema.categories,
					eq(schema.categories.id, schema.transactions.category_id)
				);

			const { categories, transactions } = formData[0];
			setTransactionAmount(transactions?.amount.toString()!);
			setSelectedCategory(categories!);
			setTransactionDate(new Date(transactions?.created_at!));
			setNote(transactions?.note!);
			setImage(transactions?.image!);
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
						transactionCategory="transfer"
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
				onPress={() => updateTransferRecord(Number(id))}
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
		opacity: 0.7,
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

