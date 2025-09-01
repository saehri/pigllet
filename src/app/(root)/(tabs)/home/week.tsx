import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { AnimatedFAB, Text, useTheme } from 'react-native-paper';

import { getCardPosition } from '@/utils/utils';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';

import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';
import HomeHeaderContainer from '@/src/components/home/home-header-container';
import TransactionsSummary from '@/src/components/charts/transactions-summary';

export default function WeekTransactionScreen() {
	const theme = useTheme();
	const router = useRouter();

	const [isExtended, setIsExtended] = useState(true);

	const { data: transactions } = useLiveQuery(loadTransactionsData({}));

	const onScroll = ({ nativeEvent }: any) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

		setIsExtended(currentScrollPosition <= 0);
	};

	const renderHeader = useCallback(() => {
		return (
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
		);
	}, []);

	const renderTransactionGroup = useCallback(
		({ item }: any) => (
			<View style={styles.transactionListContainer}>
				<Text style={styles.transactionListTitle} variant="bodySmall">
					{item.created_date}
				</Text>
				<View style={{ gap: 2 }}>
					{item.transactions.map((data: any, index: number) => (
						<TransactionCard
							key={data.transaction.id}
							data={data}
							showDate={false}
							position={getCardPosition(index, item.transactions.length)}
						/>
					))}
				</View>
			</View>
		),
		[]
	);

	return (
		<>
			<FlatList
				onScroll={onScroll}
				ListHeaderComponent={renderHeader}
				style={{ backgroundColor: theme.colors.background }}
				contentContainerStyle={{ paddingBottom: transactions.length ? 150 : 0 }}
				ListEmptyComponent={<NoItemNotice />}
				showsVerticalScrollIndicator={false}
				data={groupedTransactionsByDate(transactions as any, 'YYYY')}
				renderItem={renderTransactionGroup}
			/>

			<AnimatedFAB
				label="Add expense"
				icon="plus"
				style={styles.fab}
				onPress={() => router.push('/(root)/new-transactions/expense')}
				variant="secondary"
				extended={isExtended}
			/>
		</>
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
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 80,
	},
});

