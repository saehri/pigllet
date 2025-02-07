import { router } from 'expo-router';
import { Appbar } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TodayTransaction from '@/components/home/today-transactions';
import BudgetStatsWidget from '@/components/home/budget-stats-widget';
import AccountOverviewWidget from '@/components/home/account-overview-widget';
import TransactionHistory from '@/components/home/transaction-history';

export default function TransactionScreen() {
	return (
		<SafeAreaView>
			<ScrollView
				stickyHeaderHiddenOnScroll
				stickyHeaderIndices={[0]}
				showsVerticalScrollIndicator={false}
			>
				<Appbar>
					<Appbar.Content title="Pigllet" titleStyle={{ fontWeight: 'bold' }} />

					<Appbar.Action
						icon="cog-outline"
						onPress={() => router.push('/setting-screen')}
					/>
				</Appbar>

				<AccountOverviewWidget />
				<BudgetStatsWidget />
				<TodayTransaction />
				<TransactionHistory />
			</ScrollView>
		</SafeAreaView>
	);
}
