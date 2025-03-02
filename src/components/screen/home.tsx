import { ScrollView } from 'react-native';

import TodayTransaction from '@/src/components/home/today-transactions';
import BudgetStatsWidget from '@/src/components/home/budget-stats-widget';
import AccountOverviewWidget from '@/src/components/home/account-overview-widget';

export default function TransactionScreen() {
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
		>
			<AccountOverviewWidget />
			<BudgetStatsWidget />
			<TodayTransaction />
		</ScrollView>
	);
}
