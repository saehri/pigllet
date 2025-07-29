import { View } from 'react-native';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';
import { Text } from 'react-native-paper';

import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';
import HomeBottomSheets from '@/src/components/home/home-bottom-sheets';
import HomeHeaderContainer from '@/src/components/home/home-header-container';
import TransactionsSummary from '@/src/components/charts/transactions-summary';

export default function HomeScreen() {
	const { data: transactions } = useLiveQuery(loadTransactionsData());

	return (
		<View style={{ flex: 1 }}>
			<HomeHeaderContainer>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						paddingHorizontal: 16,
						alignItems: 'center',
						height: 40,
					}}
				>
					<Text style={{ fontFamily: 'Manrope-Medium' }} variant="titleLarge">
						All transactions
					</Text>
				</View>
				<TransactionsSummaryChart
					transactions={transactions}
					dateFormat="YYYY"
				/>
				<TransactionsSummary />
			</HomeHeaderContainer>

			<HomeBottomSheets
				transactions={groupedTransactionsByDate(transactions, 'YYYY')}
			/>
		</View>
	);
}

