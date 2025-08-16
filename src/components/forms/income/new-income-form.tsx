import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import useTransactionsManager from '@/src/hooks/useTransactionsManager';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

import NoteInput from '../note-input';
import DatePicker from '../date-picker';
import AccountSelector from '../account-selector';
import CustomTextInput from '../custom-text-input';
import TransactionCategorySelector from '../transaction-category-selector';

export default function CreateIncomeForm() {
	const { currentCurrencyCode } = usePreferredCurrencyStore();

	const {
		transactionUsedAccount,
		transactionCategories,
		transactionCreatedAt,
		transactionCategory,
		transactionAmount,
		transactionImage,
		transactionNote,
		userAccounts,
		loading,
		createIncomeRecord,
		setTransactionNote,
		setTransactionImage,
		setTransactionAmount,
		setTransactionCategory,
		setTransactionCreatedAt,
		setTransactionUsedAccount,
	} = useTransactionsManager({
		transactionType: 'income',
		actionType: 'create',
	});

	return (
		<View style={styles.formWrapper}>
			<View style={styles.inputContainerFull}>
				<Text style={styles.inputLabel} variant="bodyMedium">
					Amount ({currentCurrencyCode})
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
						Expense category
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
					To account
				</Text>

				<AccountSelector
					accounts={userAccounts}
					selectedAccount={transactionUsedAccount!}
					handleSelect={setTransactionUsedAccount as any}
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
				contentStyle={styles.buttonContent}
				labelStyle={styles.buttonLabel}
				onPress={createIncomeRecord}
				disabled={loading || !transactionAmount.length}
				loading={loading}
			>
				Save income record
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

