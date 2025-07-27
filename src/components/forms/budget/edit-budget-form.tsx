import { StyleSheet, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';

import useBudgetManager from '@/src/hooks/useBudgetManager';

import SelectInputWithIcon from '../select-input-with-icon';

type Props = {
	budgetId: number;
};

export default function EditBudgetForm({ budgetId }: Props) {
	const theme = useTheme();

	const {
		transactionCategories,
		budgetMaxSpending,
		budgetCategory,
		budgetNote,
		loading,
		setBudgetNote,
		setBudgetCategory,
		updateBudgetRecord,
		setBudgetMaxSpending,
	} = useBudgetManager({ actionType: 'update', budgetId });

	return (
		<View style={styles.formWrapper}>
			<View style={styles.gridContainer}>
				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Budget category
					</Text>
					<SelectInputWithIcon
						data={transactionCategories}
						selectedCategory={budgetCategory}
						handleSelect={setBudgetCategory}
					/>
				</View>

				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Max spending
					</Text>
					<TextInput
						keyboardType="decimal-pad"
						value={budgetMaxSpending}
						onChangeText={setBudgetMaxSpending}
						contentStyle={styles.inputContent}
					/>
				</View>
			</View>

			<View style={styles.gridContainer}>
				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Note
					</Text>
					<TextInput
						value={budgetNote}
						onChangeText={setBudgetNote}
						contentStyle={styles.inputContent}
					/>
				</View>
			</View>

			<Button
				mode="contained"
				style={styles.button}
				labelStyle={styles.buttonLabel}
				onPress={updateBudgetRecord}
				disabled={!budgetMaxSpending.length}
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
	button: { borderRadius: 10, marginTop: 16, padding: 8, marginBottom: 8 },
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
	inputInfo: {
		opacity: 0.8,
		fontFamily: 'Manrope-Regular',
	},
	inputInfoContainer: {
		marginTop: 8,
	},
});

