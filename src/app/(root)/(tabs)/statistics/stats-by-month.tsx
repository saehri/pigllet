import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import AverageSpending from '@/src/components/statistics/average-spending';
import MonthSelectorBar from '@/src/components/reusables/month-selector-bar';
import StatsViewToggle from '@/src/components/statistics/stats-view-toggle';
import {
	ExpensesByCategoryWrapper,
	ExpensesOverTimeWrapper,
	IncomesByCategoryWrapper,
	IncomesOverTimeWrapper,
	TransfersByCategoryWrapper,
	TransfersOverTimeWrapper,
} from '@/src/components/statistics/statistic-widgets';

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
			<View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
				<MonthSelectorBar
					onNext={gotToNextMonth}
					onPrev={goToPreviousMonth}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>

				<StatsViewToggle />
			</View>

			<View style={styles.chartsContainer}>
				<AverageSpending selectedDate={selectedDate} range="month" />
				<ExpensesOverTimeWrapper selectedDate={selectedDate} range="month" />
				<IncomesOverTimeWrapper selectedDate={selectedDate} range="month" />
				<TransfersOverTimeWrapper selectedDate={selectedDate} range="month" />
				<ExpensesByCategoryWrapper selectedDate={selectedDate} range="month" />
				<IncomesByCategoryWrapper selectedDate={selectedDate} range="month" />
				<TransfersByCategoryWrapper selectedDate={selectedDate} range="month" />
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

