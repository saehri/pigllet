import {
	Text,
	Button,
	useTheme,
	TextInput,
	ActivityIndicator,
} from 'react-native-paper';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import DatePicker from '../date-picker';
import ImageSelectorInput from '../image-select-input';
import SelectInputWithIcon from '../select-input-with-icon';
import useTransactionsManager from '@/src/hooks/useTransactionsManager';

export default function EditTransferForm() {
	const theme = useTheme();

	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;
	const { id } = useLocalSearchParams();

	const {
		transactionCategories,
		transactionCreatedAt,
		transactionCategory,
		transactionAmount,
		transactionImage,
		transactionNote,
		loading,
		setTransactionNote,
		setTransactionImage,
		updateTransferRecord,
		setTransactionAmount,
		setTransactionCategory,
		setTransactionCreatedAt,
		setTransactionUsedAccount,
		setTransactionUsedRelatedAccount,
	} = useTransactionsManager({
		actionType: 'update',
		transactionId: Number(id),
		transactionType: 'transfer',
	});

	return (
		<View style={styles.formWrapper}>
			<View style={styles.gridContainer}>
				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Transfer category
					</Text>
					<SelectInputWithIcon
						data={transactionCategories}
						selectedCategory={transactionCategory}
						handleSelect={setTransactionCategory}
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
					/>
				</View>
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
				<TextInput onChangeText={setTransactionNote} value={transactionNote} />
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
				onPress={updateTransferRecord}
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

