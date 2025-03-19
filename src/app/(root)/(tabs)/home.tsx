import { ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

import TodayTransaction from '@/src/components/home/today-transactions';
import BudgetStatsWidget from '@/src/components/home/budget-stats-widget';
import AccountOverviewWidget from '@/src/components/home/account-overview-widget';

export default function TransactionScreen() {
	const theme = useTheme();

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={{ backgroundColor: theme.colors.background }}
		>
			<AccountOverviewWidget />
			<BudgetStatsWidget />
			<TodayTransaction />
		</ScrollView>
	);
}
