import { View } from 'react-native';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import DatePicker from '../date-picker';
import AccountSelector from '../account-selector';
import useTransactionsManager from '@/src/hooks/useTransactionsManager';
import ImageSelectorInput from '../image-select-input';
import SelectInputWithIcon from '../select-input-with-icon';

export default function CreateExpenseForm() {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

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
		createExpenseRecord,
		setTransactionUsedAccount,
	} = useTransactionsManager({
		actionType: 'create',
		transactionType: 'expense',
	});

	return (
		<View style={styles.formWrapper}>
			<View style={styles.gridContainer}>
				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						From
					</Text>
					<AccountSelector
						accounts={userAccounts}
						handleSelect={setTransactionUsedAccount}
						selectedAccount={transactionUsedAccount}
					/>
				</View>

				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Amount ({currentCurrencySymbol})
					</Text>
					<TextInput
						keyboardType="number-pad"
						onChangeText={setTransactionAmount}
						value={transactionAmount}
						contentStyle={styles.inputContent}
					/>
				</View>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Expense category
				</Text>
				<SelectInputWithIcon
					data={transactionCategories}
					selectedCategory={transactionCategory}
					handleSelect={setTransactionCategory}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Date
				</Text>
				<DatePicker
					selectedDate={transactionCreatedAt}
					setSelectedDate={setTransactionCreatedAt}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Note
				</Text>
				<TextInput
					value={transactionNote}
					onChangeText={setTransactionNote}
					contentStyle={styles.inputContent}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Add image
				</Text>
				<ImageSelectorInput
					selectedImage={transactionImage}
					handleSelect={setTransactionImage}
				/>
			</View>

			<Button
				mode="contained"
				style={styles.button}
				labelStyle={styles.buttonLabel}
				onPress={createExpenseRecord}
				disabled={!transactionAmount.length}
			>
				{loading ? (
					<ActivityIndicator size={20} color={theme.colors.onPrimary} />
				) : (
					'Save transaction'
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
	button: { borderRadius: 10, marginTop: 16, padding: 8 },
	buttonLabel: {
		fontFamily: 'Inter-Medium',
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

