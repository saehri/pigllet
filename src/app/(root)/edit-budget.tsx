import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

import useBudgetManager from '@/src/hooks/useBudgetManager';
import { useCurrencyStyle } from '@/store/useCurrencyStyle';

import CustomTextInput from '@/src/components/forms/custom-text-input';
import { useEffect } from 'react';

export default function EditBudget() {
	const { id, budgetLimit: limit } = useLocalSearchParams();
	const currentCurrencyCode = useCurrencyStyle((s) => s.currentCurrencyCode);

	const { loading, budgetLimit, updateBudgetRecord, setBudgetLimit } =
		useBudgetManager();

	useEffect(() => {
		setBudgetLimit(limit as string);
	}, []);

	return (
		<View style={styles.formWrapper}>
			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Budet limit *
				</Text>

				<CustomTextInput
					keyboardType="number-pad"
					value={budgetLimit}
					onChangeText={setBudgetLimit}
					leftComponent={
						<Text
							style={{ fontFamily: 'Manrope-Regular' }}
							variant="labelMedium"
						>
							{currentCurrencyCode}
						</Text>
					}
				/>
			</View>

			<Button
				mode="contained"
				style={styles.button}
				labelStyle={styles.buttonLabel}
				onPress={() => updateBudgetRecord(Number(id))}
				disabled={loading || !budgetLimit.length}
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

