import { EyeIcon } from 'lucide-react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import YearSelectorBar from '@/src/components/reusables/year-selector-bar';
import AverageSpending from '@/src/components/statistics/average-spending';
import TransactionsOverTime from '@/src/components/statistics/transactions-over-time';
import TransactionsByCategory from '@/src/components/charts/transactions-by-category';

export default function StatsAllScreen() {
	const theme = useTheme();

	// --- widget visibility state
	const [showExpenseByCategory, setShowExpenseByCategory] = useState(true);
	const [showIncomeByCategory, setShowIncomeByCategory] = useState(true);
	const [showTransferByCategory, setShowTransferByCategory] = useState(true);
	const [showExpenseByDate, setShowExpenseByDate] = useState(true);
	const [showIncomeByDate, setShowIncomeByDate] = useState(true);
	const [showTransferByDate, setShowTransferByDate] = useState(true);

	const bottomSheetRef = useRef<BottomSheet>(null);

	return (
		<>
			<ScrollView
				contentContainerStyle={{
					paddingTop: 60,
					paddingBottom: 80,
				}}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.chartsContainer}>
					<Button
						onPress={() => bottomSheetRef.current?.snapToIndex(1)}
						mode="contained-tonal"
						icon={(props) => (
							<EyeIcon
								size={props.size}
								color={props.color}
								strokeWidth={1.5}
							/>
						)}
						style={{
							height: 40,
							width: 100,
							alignSelf: 'flex-end',
							marginRight: 16,
						}}
						labelStyle={{ fontFamily: 'Manrope-Regular' }}
					>
						View
					</Button>

					{showExpenseByDate && (
						<TransactionsOverTime
							name="Expenses by date"
							transactionType="expense"
						/>
					)}

					{showIncomeByDate && (
						<TransactionsOverTime
							name="Incomes by date"
							transactionType="income"
						/>
					)}

					{showTransferByDate && (
						<TransactionsOverTime
							name="Transfers by date"
							transactionType="transfer"
						/>
					)}

					{showExpenseByCategory && (
						<TransactionsByCategory
							type="expense"
							name="Expenses by category"
							range="year"
						/>
					)}

					{showIncomeByCategory && (
						<TransactionsByCategory
							type="income"
							name="Incomes by category"
							range="year"
						/>
					)}
					{showTransferByCategory && (
						<TransactionsByCategory
							type="transfer"
							name="Transfers by category"
							range="year"
						/>
					)}
				</View>
			</ScrollView>

			<BottomSheet
				ref={bottomSheetRef}
				snapPoints={['50%', '85%']}
				enableContentPanningGesture={false}
				enablePanDownToClose={true}
				overDragResistanceFactor={0.5}
				enableDynamicSizing={false}
				backgroundStyle={{
					backgroundColor: theme.colors.elevation.level1,
				}}
				index={-1}
				handleIndicatorStyle={{
					backgroundColor: theme.colors.secondary,
					height: 6,
					width: 35,
				}}
			>
				<BottomSheetView style={{ paddingHorizontal: 16, gap: 2 }}>
					<Text style={styles.checkboxSectionTitle}>By date</Text>
					<ToggleButton
						currentValue={showExpenseByDate}
						setCurrentValue={setShowExpenseByDate}
						label="Expenses by date"
						position="first"
					/>
					<ToggleButton
						currentValue={showIncomeByDate}
						setCurrentValue={setShowIncomeByDate}
						label="Incomes by date"
						position="middle"
					/>
					<ToggleButton
						currentValue={showTransferByDate}
						setCurrentValue={setShowTransferByDate}
						label="Transfers by date"
						position="last"
					/>

					<Text style={[styles.checkboxSectionTitle, { marginTop: 16 }]}>
						By category
					</Text>
					<ToggleButton
						currentValue={showExpenseByCategory}
						setCurrentValue={setShowExpenseByCategory}
						label="Expenses by category"
						position="first"
					/>
					<ToggleButton
						currentValue={showIncomeByCategory}
						setCurrentValue={setShowIncomeByCategory}
						label="Incomes by category"
						position="middle"
					/>
					<ToggleButton
						currentValue={showTransferByCategory}
						setCurrentValue={setShowTransferByCategory}
						label="Transfers by category"
						position="last"
					/>
				</BottomSheetView>
			</BottomSheet>
		</>
	);
}

type ToggleButtonProps = {
	label: string;
	currentValue: boolean;
	setCurrentValue: Dispatch<SetStateAction<boolean>>;
	position: 'first' | 'middle' | 'last' | 'only';
};

const borderRadius = {
	tr: {
		first: 16,
		middle: 6,
		only: 16,
		last: 6,
	},
	tl: {
		first: 16,
		middle: 6,
		only: 16,
		last: 6,
	},
	br: {
		first: 6,
		middle: 6,
		only: 16,
		last: 16,
	},
	bl: {
		first: 6,
		middle: 6,
		only: 16,
		last: 16,
	},
};

function ToggleButton({
	currentValue,
	label,
	setCurrentValue,
	position,
}: ToggleButtonProps) {
	const theme = useTheme();

	return (
		<View
			style={[
				styles.checkboxContainer,
				{
					backgroundColor: theme.colors.elevation.level4,
					borderTopRightRadius: borderRadius.tr[position],
					borderTopLeftRadius: borderRadius.tl[position],
					borderBottomLeftRadius: borderRadius.bl[position],
					borderBottomRightRadius: borderRadius.br[position],
				},
			]}
		>
			<Text variant="bodyLarge" style={styles.checkboxTitle}>
				{label}
			</Text>

			<Pressable
				onPress={() => setCurrentValue((prev) => !prev)}
				style={[
					styles.checkboxButton,
					{
						borderColor: theme.colors.outlineVariant,
						backgroundColor: theme.colors.elevation.level2,
						justifyContent: currentValue ? 'flex-end' : 'flex-start',
					},
				]}
			>
				<View
					style={[
						styles.checkboxButtonIndicator,
						{ backgroundColor: theme.colors.secondary },
					]}
				></View>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	chartsContainer: {
		marginTop: 24,
		gap: 4,
	},
	checkboxContainer: {
		padding: 16,
		borderRadius: 6,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	checkboxTitle: {
		fontFamily: 'Manrope-Regular',
	},
	checkboxButton: {
		height: 24,
		width: 60,
		borderWidth: 1,
		borderRadius: 100,
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 3,
	},
	checkboxButtonIndicator: {
		width: 35,
		height: 15,
		borderRadius: 100,
	},
	checkboxSectionTitle: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
		marginBottom: 12,
	},
});

