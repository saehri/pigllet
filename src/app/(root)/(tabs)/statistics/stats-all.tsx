import { useRef, useState } from 'react';
import { LayoutDashboardIcon } from 'lucide-react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { ScrollView, StyleSheet, View } from 'react-native';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import TransactionsOverTime from '@/src/components/statistics/transactions-over-time';
import TransactionsByCategory from '@/src/components/charts/transactions-by-category';
import BottomSheetToggleButton from '@/src/components/statistics/bottom-sheet-toggle-button';

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
				<View>
					<Button
						compact
						mode="contained-tonal"
						style={{
							height: 40,
							width: 40,
							alignSelf: 'flex-end',
							marginRight: 16,
						}}
						onPress={() => bottomSheetRef.current?.expand()}
					>
						<LayoutDashboardIcon
							size={20}
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
						/>
					</Button>

					<View style={styles.chartsContainer}>
						{showExpenseByDate && (
							<TransactionsOverTime
								name="All your expenses"
								descriptions="See how much you spend each year"
								transactionType="expense"
							/>
						)}

						{showIncomeByDate && (
							<TransactionsOverTime
								name="All your incomes"
								descriptions="See how much you earn each year"
								transactionType="income"
							/>
						)}

						{showTransferByDate && (
							<TransactionsOverTime
								name="Money transfered"
								descriptions="See how your money moves between accounts"
								transactionType="transfer"
							/>
						)}

						{showExpenseByCategory && (
							<TransactionsByCategory
								type="expense"
								name="Where your money goes"
								descriptions="See the distribution of expenses by category"
							/>
						)}

						{showIncomeByCategory && (
							<TransactionsByCategory
								type="income"
								name="Where your money comes"
								descriptions="See the distribution of incomes by category"
							/>
						)}
						{showTransferByCategory && (
							<TransactionsByCategory
								type="transfer"
								name="Transfers by category"
							/>
						)}
					</View>
				</View>
			</ScrollView>

			<BottomSheet
				ref={bottomSheetRef}
				snapPoints={['50%', '93%']}
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
					<BottomSheetToggleButton
						currentValue={showExpenseByDate}
						setCurrentValue={setShowExpenseByDate}
						label="Expenses by date"
						position="first"
					/>
					<BottomSheetToggleButton
						currentValue={showIncomeByDate}
						setCurrentValue={setShowIncomeByDate}
						label="Incomes by date"
						position="middle"
					/>
					<BottomSheetToggleButton
						currentValue={showTransferByDate}
						setCurrentValue={setShowTransferByDate}
						label="Transfers by date"
						position="last"
					/>

					<Text style={[styles.checkboxSectionTitle, { marginTop: 16 }]}>
						By category
					</Text>
					<BottomSheetToggleButton
						currentValue={showExpenseByCategory}
						setCurrentValue={setShowExpenseByCategory}
						label="Expenses by category"
						position="first"
					/>
					<BottomSheetToggleButton
						currentValue={showIncomeByCategory}
						setCurrentValue={setShowIncomeByCategory}
						label="Incomes by category"
						position="middle"
					/>
					<BottomSheetToggleButton
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

const styles = StyleSheet.create({
	chartsContainer: {
		marginTop: 24,
		gap: 4,
	},
	checkboxSectionTitle: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
		marginBottom: 12,
	},
});

