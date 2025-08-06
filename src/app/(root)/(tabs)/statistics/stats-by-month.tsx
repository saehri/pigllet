import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import AverageSpending from '@/src/components/statistics/average-spending';
import MonthSelectorBar from '@/src/components/reusables/month-selector-bar';
import TransactionsOverTime from '@/src/components/statistics/transactions-over-time';
import TransactionsByCategory from '@/src/components/charts/transactions-by-category';

export default function StatsMonthlyScreen() {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
				/>

				<View style={styles.chartsContainer}>
					<AverageSpending selectedDate={selectedDate} range="month" />
					<TransactionsOverTime range="month" selectedDate={selectedDate} />
					<TransactionsByCategory
						type="expense"
						range="month"
						selectedDate={selectedDate}
						name="Expenses by category"
					/>
					<TransactionsByCategory
						type="income"
						range="month"
						selectedDate={selectedDate}
						name="Incomes by category"
					/>
					<TransactionsByCategory
						type="transfer"
						range="month"
						selectedDate={selectedDate}
						name="Transfers by category"
					/>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	chartsContainer: {
		marginTop: 24,
		gap: 4,
	},
});

