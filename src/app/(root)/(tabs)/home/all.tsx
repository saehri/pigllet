import { Text, useTheme } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';

import { getCardPosition } from '@/utils/utils';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';

import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';
import HomeHeaderContainer from '@/src/components/home/home-header-container';
import TransactionsSummary from '@/src/components/charts/transactions-summary';

export default function HomeScreen() {
	const theme = useTheme();

	const { data: transactions } = useLiveQuery(loadTransactionsData({}));

	return (
		<FlatList
			ListHeaderComponent={() => (
				<HomeHeaderContainer>
					<TransactionsSummary range="month" />

					<Text
						variant="titleLarge"
						style={{
							marginLeft: 16,
							marginTop: 16,
							marginBottom: 12,
							fontFamily: 'Manrope-Regular',
						}}
					>
						Transactions
					</Text>
				</HomeHeaderContainer>
			)}
			style={{ backgroundColor: theme.colors.background }}
			contentContainerStyle={{ paddingBottom: transactions.length ? 180 : 0 }}
			ListEmptyComponent={<NoItemNotice />}
			showsVerticalScrollIndicator={false}
			data={groupedTransactionsByDate(transactions as any, 'YYYY')}
			renderItem={({ item }) => (
				<View style={styles.transactionListContainer} key={item.created_date}>
					<Text style={styles.transactionListTitle} variant="bodySmall">
						{item.created_date}
					</Text>

					<View style={{ gap: 2 }}>
						{item.transactions.map((data, index) => (
							<TransactionCard
								key={data.transaction.id}
								data={data}
								showDate={false}
								position={getCardPosition(index, item.transactions.length)}
							/>
						))}
					</View>
				</View>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	transactionListTitle: {
		fontFamily: 'Manrope-Light',
		opacity: 0.7,
	},
	transactionListContainer: {
		paddingHorizontal: 16,
		paddingBottom: 12,
		gap: 8,
	},
});

