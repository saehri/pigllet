import { router } from 'expo-router';
import { Appbar } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TodayTransaction from '@/src/components/home/today-transactions';
import BudgetStatsWidget from '@/src/components/home/budget-stats-widget';
import AccountOverviewWidget from '@/src/components/home/account-overview-widget';

export default function TransactionScreen() {
	return (
		<SafeAreaView>
			<ScrollView
				stickyHeaderIndices={[0]}
				showsVerticalScrollIndicator={false}
			>
				<Appbar>
					<Appbar.Content title="Pigllet" titleStyle={{ fontWeight: 'bold' }} />

					<Appbar.Action
						icon="cog-outline"
						onPress={() => router.push('/(root)/settings')}
					/>
				</Appbar>

				<AccountOverviewWidget />
				<BudgetStatsWidget />
				<TodayTransaction />
			</ScrollView>
		</SafeAreaView>
	);
}
