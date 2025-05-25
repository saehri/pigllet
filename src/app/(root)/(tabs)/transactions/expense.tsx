import { useState } from 'react';
import { Text, useTheme } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';

import * as schema from '@/db/schema';
import { toYYYYMMDD } from '@/utils/utils';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';

import useTransactionsManager from '@/src/hooks/useTransactionsManager';

import ExpenseCard from '@/src/components/reusables/expense-card';
import ChartHeader from '@/src/components/charts/chart-header';
import ChartFooter from '@/src/components/charts/chart-footer';
import ChartWrapper from '@/src/components/charts/chart-wrapper';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';

export default function ExpensesScreen() {
	const theme = useTheme();

	// ----- used in useLiveQuery hooks to fetch the data
	const { loadExpenseData } = useTransactionsManager({
		actionType: 'read',
		transactionType: 'expense',
	});

	// ---- states used to filter and query the data
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [quickFilter, setQuickFilter] = useState('today');

	const { data: transactions } = useLiveQuery(
		loadExpenseData(toYYYYMMDD(startDate), toYYYYMMDD(endDate)),
		[startDate, endDate]
	);

	return (
		<FlatList
			ListEmptyComponent={<NoItemNotice />}
			style={{ backgroundColor: theme.colors.background }}
			data={groupedTransactionsByDate(transactions as any)}
			ListHeaderComponent={() => (
				<View style={styles.headerWrapper}>
					<ChartWrapper>
						<ChartHeader
							startDate={startDate}
							setStartDate={setStartDate}
							endDate={endDate}
							setEndDate={setEndDate}
							quickFilter={quickFilter}
							setQuickFilter={setQuickFilter}
						/>
						<TransactionsSummaryChart
							groupBy="category"
							transactions={transactions as any}
						/>
						<ChartFooter groupBy="category" transactions={transactions} />
					</ChartWrapper>
				</View>
			)}
			keyExtractor={(item) => item.created_date}
			renderItem={({ item }) => (
				<View style={{ paddingBottom: 18, gap: 8 }}>
					<Text style={styles.transactionListTitle}>{item.created_date}</Text>
					<View>
						{item.transactions.map((transaction: any) => (
							<ExpenseCard
								key={transaction.id}
								data={transaction as any}
								category={transaction.category as schema.Category}
								accountName={transaction.accountName}
							/>
						))}
					</View>
				</View>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	headerWrapper: {
		paddingHorizontal: 16,
		paddingBottom: 32,
		paddingTop: 60,
	},
	transactionListTitle: {
		fontFamily: 'Inter-Regular',
		paddingHorizontal: 16,
		fontSize: 18,
	},
});

