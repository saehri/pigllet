import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';

import useTransactionsManager from '@/src/hooks/useTransactionsManager';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

import NoteInput from '../note-input';
import DatePicker from '../date-picker';
import AccountSelector from '../account-selector';
import CustomTextInput from '../custom-text-input';
import TransactionCategorySelector from '../transaction-category-selector';

export default function EditExpenseForm() {
	const theme = useTheme();
	const { currentCurrencyCode } = usePreferredCurrencyStore();

	const { id } = useLocalSearchParams();

	const {
		transactionUsedAccount,
		transactionCreatedAt,
		transactionCategory,
		transactionAmount,
		transactionCategories,
		transactionImage,
		transactionNote,
		userAccounts,
		loading,
		setTransactionNote,
		setTransactionImage,
		setTransactionAmount,
		setTransactionCategory,
		setTransactionCreatedAt,
		updateExpenseRecord,
		setTransactionUsedAccount,
	} = useTransactionsManager({
		actionType: 'update',
		transactionId: Number(id),
		transactionType: 'expense',
	});

	return (
		<View style={styles.formWrapper}>
			<View style={styles.inputContainerFull}>
				<Text style={styles.inputLabel} variant="bodyMedium">
					Transaction amount
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
						Category
					</Text>

					<TransactionCategorySelector
						data={transactionCategories}
						selectedCategory={transactionCategory!}
						handleSelect={setTransactionCategory as any}
					/>
				</View>

				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyMedium">
						Date
					</Text>

					<DatePicker
						selectedDate={transactionCreatedAt}
						setSelectedDate={setTransactionCreatedAt}
					/>
				</View>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel} variant="bodyMedium">
					Account used
				</Text>

				<AccountSelector
					accounts={userAccounts}
					handleSelect={setTransactionUsedAccount as any}
					selectedAccount={transactionUsedAccount!}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel} variant="bodyMedium">
					Note
				</Text>

				<NoteInput
					noteValue={transactionNote}
					setNoteValue={setTransactionNote}
					imageValue={transactionImage}
					setImageValue={setTransactionImage}
				/>
			</View>

			<Button
				mode="contained"
				style={styles.button}
				labelStyle={styles.buttonLabel}
				onPress={updateExpenseRecord}
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

