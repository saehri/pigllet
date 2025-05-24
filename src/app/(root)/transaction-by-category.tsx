import { Text } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import * as schema from '@/db/schema';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { alias } from 'drizzle-orm/sqlite-core';
import { toYYYYMMDD } from '@/utils/utils';
import { and, eq, sql } from 'drizzle-orm';
import { groupedTransactionsByDate } from '@/utils/group-transactions';

import ChartHeader from '@/src/components/charts/chart-header';
import ChartFooter from '@/src/components/charts/chart-footer';
import ChartWrapper from '@/src/components/charts/chart-wrapper';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';

export default function TransactionByCategoryScreen() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const navigation = useNavigation();

	const { categoryId, categoryName } = useLocalSearchParams();

	// ---- states used to filter and query the data
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [quickFilter, setQuickFilter] = useState('today');

	const relatedAccounts = alias(schema.accounts, 'related_accounts'); // Alias for related accounts

	const { data: transactions } = useLiveQuery(
		drizzleDb
			.select({
				id: schema.transactions.id,
				amount: schema.transactions.amount,
				note: schema.transactions.note,
				account_id: schema.transactions.account_id,
				related_account_id: schema.transactions.related_account_id,
				category_id: schema.transactions.category_id,
				type: schema.transactions.type,
				image: schema.transactions.image,
				created_at: schema.transactions.created_at,
				account: {
					id: schema.accounts.id,
					name: schema.accounts.name,
					number: schema.accounts.number,
					balance: schema.accounts.balance,
					is_cash: schema.accounts.is_cash,
					image: schema.accounts.image,
					created_at: schema.accounts.created_at,
				},
				category: {
					id: schema.categories.id,
					label: schema.categories.label,
					icon_name: schema.categories.icon_name,
					type: schema.categories.type,
				},
				related_account: {
					id: relatedAccounts.id,
					name: relatedAccounts.name,
					number: relatedAccounts.number,
					balance: relatedAccounts.balance,
					is_cash: relatedAccounts.is_cash,
					image: relatedAccounts.image,
					created_at: relatedAccounts.created_at,
				},
			})
			.from(schema.transactions)
			.where(
				and(
					eq(schema.transactions.category_id, Number(categoryId)),
					sql`DATE(transactions.created_at) BETWEEN DATE(${toYYYYMMDD(startDate)}) AND DATE(${toYYYYMMDD(endDate)})`
				)
			)
			.leftJoin(
				schema.categories,
				eq(schema.transactions.category_id, schema.categories.id)
			)
			.leftJoin(
				schema.accounts,
				eq(schema.transactions.account_id, schema.accounts.id)
			)
			.leftJoin(
				relatedAccounts,
				eq(schema.transactions.related_account_id, relatedAccounts.id)
			),
		[startDate, endDate]
	);

	useEffect(() => {
		navigation.setOptions({
			title: categoryName,
		});
	}, []);

	return (
		<FlatList
			ListHeaderComponent={() => (
				<View style={styles.chartWrapperContainer}>
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
							groupBy="date"
							transactions={transactions}
						/>
						<ChartFooter transactions={transactions as any} />
					</ChartWrapper>
				</View>
			)}
			data={groupedTransactionsByDate(transactions as any)}
			ListEmptyComponent={<NoItemNotice />}
			renderItem={({ item }) => (
				<View style={styles.renderItem}>
					<Text style={styles.renderItemHeader}>{item.created_date}</Text>
					<View>
						{item.transactions.map((transaction) => (
							<TransactionCard
								key={transaction.id}
								account={transaction.account as schema.Account}
								category={transaction.category as schema.Category}
								data={transaction}
								transactionType={transaction.type as any}
								disableFirstButton
							/>
						))}
					</View>
				</View>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	chartWrapperContainer: {
		padding: 16,
		paddingBottom: 24,
	},
	renderItem: { paddingBottom: 18, gap: 8 },
	renderItemHeader: {
		fontFamily: 'Inter-Regular',
		paddingHorizontal: 16,
		fontSize: 18,
	},
});

