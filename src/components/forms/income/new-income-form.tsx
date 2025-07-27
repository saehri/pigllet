import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
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
import ImageSelectorInput from '../image-select-input';
import SelectInputWithIcon from '../select-input-with-icon';
import useTransactionsManager from '@/src/hooks/useTransactionsManager';

export default function CreateIncomeForm() {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

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
			<View style={styles.gridContainer}>
				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						To account
					</Text>
					<AccountSelector
						accounts={userAccounts}
						selectedAccount={transactionUsedAccount}
						handleSelect={setTransactionUsedAccount}
					/>
				</View>

				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Amount ({currentCurrencySymbol})
					</Text>
					<TextInput
						keyboardType="number-pad"
						value={transactionAmount}
						onChangeText={setTransactionAmount}
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
					contentStyle={styles.inputContent}
					value={transactionNote}
					onChangeText={setTransactionNote}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Add image
				</Text>
				<ImageSelectorInput
					handleSelect={setTransactionImage}
					selectedImage={transactionImage}
				/>
			</View>

			<Button
				mode="contained"
				style={styles.button}
				contentStyle={styles.buttonContent}
				labelStyle={styles.buttonLabel}
				onPress={createIncomeRecord}
				disabled={!transactionAmount.length}
			>
				{loading ? (
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
		fontFamily: 'Manrope-Regular',
	},
	inputContent: {
		fontFamily: 'Manrope-Regular',
	},
	button: { borderRadius: 10, marginTop: 16 },
	buttonContent: { padding: 8 },
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

