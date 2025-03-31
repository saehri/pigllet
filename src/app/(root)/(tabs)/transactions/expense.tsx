import { useCallback, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import * as schema from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';

import { groupedTransactionsByDate } from '@/utils/group-transactions';

import ExpenseCard from '@/src/components/reusables/expense-card';
import ChartHeader from '@/src/components/charts/chart-header';
import ChartFooter from '@/src/components/charts/chart-footer';
import ChartWrapper from '@/src/components/charts/chart-wrapper';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';

export default function ExpensesScreen() {
	const theme = useTheme();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear()
	);
	const [selectedMonth, setSelectedMonth] = useState<{
		value: number;
		label: string;
	}>({ value: new Date().getMonth(), label: '' });

	const loadExpenseData = useCallback(
		(year: number, month: number) => {
			return drizzleDb
				.select({
					id: schema.transactions.id,
					amount: schema.transactions.amount,
					note: schema.transactions.note,
					account_id: schema.transactions.account_id,
					category_id: schema.transactions.category_id,
					type: schema.transactions.type,
					image: schema.transactions.image,
					created_date: schema.transactions.created_date,
					created_month: schema.transactions.created_month,
					created_year: schema.transactions.created_year,
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
		},
		[drizzleDb]
	);

	const { data: transactions } = useLiveQuery(
		loadExpenseData(selectedYear, selectedMonth.value + 1),
		[selectedYear, selectedMonth]
	);

	return (
		<FlatList
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
					<ChartWrapper>
						<ChartHeader
							selectedYear={selectedYear}
							setSelectedYear={setSelectedYear}
							selectedMonth={selectedMonth.value + 1}
						/>
						<TransactionsSummaryChart
							groupBy="category"
							transactions={transactions as any}
						/>
						<ChartFooter
							selectedMonth={selectedMonth}
							setSelectedMonth={setSelectedMonth}
						/>
					</ChartWrapper>
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
						{item.created_date}
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
