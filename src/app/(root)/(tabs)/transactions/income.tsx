import { useCallback, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, desc, eq } from 'drizzle-orm';
import * as schema from '@/db/schema';

import { groupedTransactionsByDate } from '@/utils/group-transactions';

import IncomeCard from '@/src/components/reusables/income-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import ChartWrapper from '@/src/components/charts/chart-wrapper';
import ChartHeader from '@/src/components/charts/chart-header';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';
import ChartFooter from '@/src/components/charts/chart-footer';

export default function IncomesScreen() {
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
					accounts: schema.accounts,
				})
				.from(schema.transactions)
				.where(
					and(
						eq(schema.transactions.type, 'income')
						// eq(schema.transactions.created_month, month),
						// eq(schema.transactions.created_year, year)
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
			style={{ backgroundColor: theme.colors.background }}
			data={groupedTransactionsByDate(transactions)}
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
			ListEmptyComponent={<NoItemNotice />}
			keyExtractor={(item) => item.created_date}
			renderItem={({ item }) => (
				<View style={{ paddingBottom: 24, gap: 8 }}>
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
							<IncomeCard
								key={transaction.id}
								data={transaction as any}
								category={transaction.category as schema.TransactionCategories}
								accounts={transaction.accounts}
							/>
						))}
					</View>
				</View>
			)}
		/>
	);
}
