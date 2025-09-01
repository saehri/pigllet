import { ScrollView, StyleSheet, View } from 'react-native';

import StatsViewToggle from '@/src/components/statistics/stats-view-toggle';
import {
	ExpensesByCategoryWrapper,
	ExpensesOverTimeWrapper,
	IncomesByCategoryWrapper,
	IncomesOverTimeWrapper,
	TransfersByCategoryWrapper,
	TransfersOverTimeWrapper,
} from '@/src/components/statistics/statistic-widgets';
import { useCallback, useState } from 'react';
import AverageSpending from '@/src/components/statistics/average-spending';
import WeekSelectorBar from '@/src/components/reusables/week-selector-bar';

export default function StatsWeekScreen() {
	const [selectedDate, setSelectedDate] = useState(new Date());

	const updateWeek = useCallback((offset: number) => {
		setSelectedDate((prev) => {
			const updated = new Date(prev);
			updated.setDate(prev.getDate() + offset * 7);

			// Find Monday of this week (assuming Monday = 1, Sunday = 0)
			const day = updated.getDay();
			const diff = day === 0 ? -6 : 1 - day; // if Sunday, go back 6 days
			updated.setDate(updated.getDate() + diff);

			return updated;
		});
	}, []);

	return (
		<ScrollView
			contentContainerStyle={{
				paddingTop: 60,
				paddingBottom: 80,
			}}
			showsVerticalScrollIndicator={false}
		>
			<View>
				<View
					style={{
						flexDirection: 'row',
						paddingHorizontal: 16,
						justifyContent: 'flex-end',
					}}
				>
					<WeekSelectorBar
						onNext={() => updateWeek(1)}
						onPrev={() => updateWeek(-1)}
						selectedDate={selectedDate}
					/>

					<StatsViewToggle />
				</View>

				<View style={styles.chartsContainer}>
					<AverageSpending selectedDate={selectedDate} range="week" />
					<ExpensesOverTimeWrapper
						name="Your expenses"
						descriptions="See how much you spend in a week"
						selectedDate={selectedDate}
						range="week"
						initialSorting="asc"
					/>
					<IncomesOverTimeWrapper
						name="Your incomes"
						descriptions="See how much you earn in a week"
						selectedDate={selectedDate}
						range="week"
						initialSorting="asc"
					/>
					<TransfersOverTimeWrapper
						name="Money transfered"
						descriptions="See how your money moves between accounts"
						selectedDate={selectedDate}
						range="week"
						initialSorting="asc"
					/>
					<ExpensesByCategoryWrapper
						name="Where your money goes"
						descriptions="See the distribution of expenses by category"
						selectedDate={selectedDate}
						range="week"
					/>
					<IncomesByCategoryWrapper
						name="Where your money comes"
						descriptions="See the distribution of incomes by category"
						selectedDate={selectedDate}
						range="week"
					/>
					<TransfersByCategoryWrapper
						name="Transfers by category"
						descriptions=""
						selectedDate={selectedDate}
						range="week"
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

