import { StyleSheet, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

import AccountSelector from '../account-selector';
import SelectInputWithIcon from '../select-input-with-icon';
import DatePicker from '../date-picker';
import ImageSelectorInput from '../image-select-input';
import useTransactionsManager from '@/src/hooks/useTransactionsManager';

export default function EditIncomeForm() {
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
		updateIncomeRecord,
		setTransactionImage,
		setTransactionAmount,
		setTransactionCategory,
		setTransactionCreatedAt,
		setTransactionUsedAccount,
	} = useTransactionsManager({
		actionType: 'update',
		transactionId: Number(id),
		transactionType: 'income',
	});

	return (
		<View style={styles.formWrapper}>
			<View style={styles.gridContainer}>
				<View style={styles.inputCotainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Account
					</Text>
					<AccountSelector
						accounts={userAccounts}
						handleSelect={setTransactionUsedAccount}
						selectedAccount={transactionUsedAccount}
					/>
				</View>

				<View style={styles.inputCotainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Amount ({currentCurrencyCode})
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
					Income category
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
				labelStyle={styles.buttonLabel}
				onPress={updateIncomeRecord}
				disabled={!transactionAmount.length}
			>
				{loading ? (
					<ActivityIndicator size={20} color={theme.colors.onPrimary} />
				) : (
					'Save changes'
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
	button: { borderRadius: 10, marginTop: 16, padding: 8 },
	buttonLabel: {
		fontFamily: 'Manrope-Medium',
		fontSize: 16,
	},
	inputContainer: {
		gap: 8,
	},
	inputCotainerFull: {
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

