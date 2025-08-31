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

export default function StatsAllScreen() {
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
					<StatsViewToggle />
				</View>

				<View style={styles.chartsContainer}>
					<ExpensesOverTimeWrapper
						name="Your expenses"
						descriptions="See how much you spend each year"
					/>
					<IncomesOverTimeWrapper
						name="Your incomes"
						descriptions="See how much you earn each year"
					/>
					<TransfersOverTimeWrapper
						name="Money transfered"
						descriptions="See how your money moves between accounts"
					/>
					<ExpensesByCategoryWrapper
						name="Where your money goes"
						descriptions="See the distribution of expenses by category"
					/>
					<IncomesByCategoryWrapper
						name="Where your money comes"
						descriptions="See the distribution of incomes by category"
					/>
					<TransfersByCategoryWrapper
						name="Transfers by category"
						descriptions=""
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

