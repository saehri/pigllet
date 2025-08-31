import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';
import useBudgetManager from '@/src/hooks/useBudgetManager';
import { useCurrencyStyle } from '@/store/useCurrencyStyle';

import CustomTextInput from '../custom-text-input';
import MonthPicker from '../../reusables/month-picker';
import TransactionCategorySelector from '../transaction-category-selector';

export default function NewBudgetForm() {
	const drizzleDb = useDrizzleDB();
	const currentCurrencyCode = useCurrencyStyle((s) => s.currentCurrencyCode);

	const {
		budgetCategory,
		budgetPeriod,
		budgetLimit,
		loading,
		setBudgetLimit,
		setBudgetPeriod,
		setBudgetCategory,
		createBudgetRecord,
	} = useBudgetManager();

	useEffect(() => {
		async function loadFormData() {
			const expenseCategories = await drizzleDb
				.select()
				.from(schema.categories)
				.where(eq(schema.categories.type, 'expense'));

			setBudgetCategory(expenseCategories[0]);
		}

		loadFormData();
	}, []);

	return (
		<View style={styles.formWrapper}>
			<View style={styles.inputContainerFull}>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Spending limit
				</Text>

				<CustomTextInput
					keyboardType="number-pad"
					onChangeText={setBudgetLimit}
					value={budgetLimit}
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
					<Text style={styles.inputLabel} variant="bodyLarge">
						Budget category
					</Text>

					<TransactionCategorySelector
						transactionCategory="expense"
						selectedCategory={budgetCategory!}
						handleSelect={setBudgetCategory as any}
					/>
				</View>

				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Budget period
					</Text>

					<MonthPicker
						selectedDate={budgetPeriod}
						setSelectedDate={setBudgetPeriod}
					/>
				</View>
			</View>

			<Button
				mode="contained"
				style={styles.button}
				labelStyle={styles.buttonLabel}
				onPress={createBudgetRecord}
				disabled={!budgetLimit.length}
				loading={loading}
			>
				Save budget record
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

