import { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import * as schema from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';

import { groupedTransactionsByDate } from '@/utils/group-transactions';

import ExpenseCard from '@/src/components/reusables/expense-card';
import ChartHeader from '@/src/components/charts/chart-header';
import ChartFooter from '@/src/components/charts/chart-footer';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';

export default function ExpensesScreen() {
	const theme = useTheme();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear()
	);
	const [selectedMonth, setSelectedMonth] = useState<string>();
	const [refreshing, setRefreshing] = useState(false);

	const loadExpenseData = (year: number, month: number) => {
		return drizzleDb
			.select({
				id: schema.transactions.id,
				amount: schema.transactions.amount,
				note: schema.transactions.note,
				account_id: schema.transactions.account_id,
				related_account_id: schema.transactions.related_account_id,
				category_id: schema.transactions.category_id,
				type: schema.transactions.type,
				created_date: schema.transactions.created_date,
				created_month: schema.transactions.created_month,
				created_year: schema.transactions.created_year,
				budget_id: schema.transactions.budget_id,
				category: schema.categories,
				accountName: schema.accounts.name,
			})
			.from(schema.transactions)
			.where(
				and(
					eq(schema.transactions.type, 'expense'),
					eq(schema.transactions.created_month, month),
					eq(schema.transactions.created_year, year)
				)
			)
			.innerJoin(
				schema.categories,
				eq(schema.transactions.category_id, schema.categories.id)
			)
			.innerJoin(
				schema.accounts,
				eq(schema.transactions.account_id, schema.accounts.id)
			)
			.orderBy(desc(schema.transactions.created_date));
	};

	const { data: transactions } = useLiveQuery(
		loadExpenseData(selectedYear, 3),
		[selectedYear]
	);

	const onRefresh = async () => {
		setRefreshing(true);
		await loadExpenseData(selectedYear, 3);
		setRefreshing(false);
	};

	return (
		<FlatList
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
			ListEmptyComponent={<NoItemNotice />}
			style={{ backgroundColor: theme.colors.background }}
			data={groupedTransactionsByDate(transactions as any)}
			ListHeaderComponent={() => (
				<View
					style={{
						paddingHorizontal: 16,
						paddingBottom: 32,
						paddingTop: 60,
					}}
				>
					<TransactionsSummaryChart
						header={
							<ChartHeader
								selectedYear={selectedYear}
								setSelectedYear={setSelectedYear}
							/>
						}
						transactions={transactions as any}
						footer={<ChartFooter />}
					/>
				</View>
			)}
			keyExtractor={(item) => item.created_date.toString()}
			renderItem={({ item }) => (
				<View style={{ paddingBottom: 18, gap: 8 }}>
					<Text
						style={{
							fontFamily: 'Inter-Regular',
							paddingHorizontal: 16,
							fontSize: 18,
						}}
					>
						{new Date(item.created_date).toLocaleDateString('en-US', {
							dateStyle: 'long',
							month: 'short',
						})}
					</Text>
					<View>
						{item.transactions.map((transaction: any) => (
							<ExpenseCard
								key={transaction.id}
								data={transaction as any}
								category={transaction.category as schema.TransactionCategories}
								accountName={transaction.accountName}
							/>
						))}
					</View>
				</View>
			)}
		/>
	);
}
