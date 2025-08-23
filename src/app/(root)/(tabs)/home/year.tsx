import { Text, useTheme } from 'react-native-paper';
import { useState, useMemo, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { getCardPosition } from '@/utils/utils';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';

import TransactionHeaderBar from '@/src/components/home/transaction-header-bar';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';
import HomeHeaderContainer from '@/src/components/home/home-header-container';
import TransactionsSummary from '@/src/components/charts/transactions-summary';
import YearSelectorBar from '@/src/components/reusables/year-selector-bar';

export default function HomeYearlyTransactionScreen() {
	const theme = useTheme();

	const [selectedDate, setSelectedDate] = useState(() => new Date());

	const { data: transactions } = useLiveQuery(
		loadTransactionsData({ date: selectedDate, range: 'year' }),
		[selectedDate]
	);

	const groupedTransactions = useMemo(() => {
		return groupedTransactionsByDate(transactions as any, 'MMMM, YYYY');
	}, [transactions]);

	const updateYear = useCallback((offset: number) => {
		setSelectedDate((prev) => {
			const updated = new Date(prev);
			updated.setFullYear(prev.getFullYear() + offset);
			return updated;
		});
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

	const renderHeader = useCallback(() => {
		return (
			<HomeHeaderContainer>
				<YearSelectorBar
					onNext={() => updateYear(1)}
					onPrev={() => updateYear(-1)}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>

				<TransactionsSummary selectedDate={selectedDate} range="month" />

				<TransactionHeaderBar />
			</HomeHeaderContainer>
		);
	}, [selectedDate, updateYear]);

	return (
		<FlatList
			data={groupedTransactions}
			showsVerticalScrollIndicator={false}
			style={{ backgroundColor: theme.colors.background }}
			contentContainerStyle={{ paddingBottom: transactions.length ? 180 : 0 }}
			ListEmptyComponent={<NoItemNotice />}
			ListHeaderComponent={renderHeader}
			renderItem={renderTransactionGroup}
			keyExtractor={(item) => item.created_date}
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

