import { useRef, useState } from 'react';
import { LayoutDashboardIcon } from 'lucide-react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { ScrollView, StyleSheet, View } from 'react-native';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import AverageSpending from '@/src/components/statistics/average-spending';
import MonthSelectorBar from '@/src/components/reusables/month-selector-bar';
import TransactionsOverTime from '@/src/components/statistics/transactions-over-time';
import TransactionsByCategory from '@/src/components/charts/transactions-by-category';
import BottomSheetToggleButton from '@/src/components/statistics/bottom-sheet-toggle-button';

export default function StatsMonthlyScreen() {
	const theme = useTheme();

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	// --- widget visibility state
	const [showExpenseByCategory, setShowExpenseByCategory] = useState(true);
	const [showIncomeByCategory, setShowIncomeByCategory] = useState(true);
	const [showTransferByCategory, setShowTransferByCategory] = useState(true);
	const [showExpenseByDate, setShowExpenseByDate] = useState(true);
	const [showIncomeByDate, setShowIncomeByDate] = useState(true);
	const [showTransferByDate, setShowTransferByDate] = useState(true);

	const bottomSheetRef = useRef<BottomSheet>(null);

	function gotToNextMonth() {
		const updatedDate = new Date(selectedDate);
		updatedDate.setMonth(updatedDate.getMonth() + 1); // Handles year rollover automatically
		setSelectedDate(updatedDate);
	}

	function goToPreviousMonth() {
		const updatedDate = new Date(selectedDate);
		updatedDate.setMonth(updatedDate.getMonth() - 1); // Handles year rollover automatically
		setSelectedDate(updatedDate);
	}

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
					<MonthSelectorBar
						onNext={gotToNextMonth}
						onPrev={goToPreviousMonth}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						additionalButton={() => (
							<Button
								compact
								mode="contained-tonal"
								contentStyle={{ height: 40, width: 40 }}
								onPress={() => bottomSheetRef.current?.expand()}
							>
								<LayoutDashboardIcon
									size={20}
									strokeWidth={1.5}
									color={theme.colors.onSecondaryContainer}
								/>
							</Button>
						)}
					/>

					<View style={styles.chartsContainer}>
						<AverageSpending selectedDate={selectedDate} range="month" />

						{showExpenseByDate && (
							<TransactionsOverTime
								name="Your expenses this month"
								descriptions="See how much you spend daily"
								transactionType="expense"
								range="month"
								selectedDate={selectedDate}
							/>
						)}

						{showIncomeByDate && (
							<TransactionsOverTime
								name="Your incomes this month"
								descriptions="See how much you earn daily"
								transactionType="income"
								range="month"
								selectedDate={selectedDate}
							/>
						)}

						{showTransferByDate && (
							<TransactionsOverTime
								name="Money transfered this month"
								descriptions="See how your money moves between accounts"
								transactionType="transfer"
								range="month"
								selectedDate={selectedDate}
							/>
						)}

						{showExpenseByCategory && (
							<TransactionsByCategory
								type="expense"
								range="month"
								selectedDate={selectedDate}
								name="Where your money goes"
								descriptions="See the distribution of expenses by category"
							/>
						)}

						{showIncomeByCategory && (
							<TransactionsByCategory
								type="income"
								range="month"
								selectedDate={selectedDate}
								name="Where your money comes"
								descriptions="See the distribution of incomes by category"
							/>
						)}
						{showTransferByCategory && (
							<TransactionsByCategory
								type="transfer"
								range="month"
								selectedDate={selectedDate}
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

