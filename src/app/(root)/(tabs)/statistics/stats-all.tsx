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
					<ExpensesOverTimeWrapper />
					<IncomesOverTimeWrapper />
					<TransfersOverTimeWrapper />
					<ExpensesByCategoryWrapper />
					<IncomesByCategoryWrapper />
					<TransfersByCategoryWrapper />
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

