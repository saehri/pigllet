import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, desc, eq, sql } from 'drizzle-orm';
import * as schema from '@/db/schema';

import { groupedTransactionsByDate } from '@/utils/group-transactions';

import IncomeCard from '@/src/components/reusables/income-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import ChartWrapper from '@/src/components/charts/chart-wrapper';
import ChartHeader from '@/src/components/charts/chart-header';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';
import ChartFooter from '@/src/components/charts/chart-footer';
import { toYYYYMMDD } from '@/utils/utils';

export default function IncomesScreen() {
	const theme = useTheme();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [quickFilter, setQuickFilter] = useState('today');

	const loadExpenseData = (startDate: string, endDate: string) =>
		drizzleDb
			.select({
				id: schema.transactions.id,
				amount: schema.transactions.amount,
				note: schema.transactions.note,
				account_id: schema.transactions.account_id,
				category_id: schema.transactions.category_id,
				type: schema.transactions.type,
				image: schema.transactions.image,
				created_at: schema.transactions.created_at,
				category: schema.categories,
				accountName: schema.accounts.name,
			})
			.from(schema.transactions)
			.where(
				and(
					eq(schema.transactions.type, 'income'),
					sql`DATE(transactions.created_at) BETWEEN DATE(${startDate}) AND DATE(${endDate})`
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
			.orderBy(desc(schema.transactions.created_at));

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
				<View
					style={{
						paddingHorizontal: 16,
						paddingBottom: 32,
						paddingTop: 60,
					}}
				>
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
						<ChartFooter transactions={transactions} />
					</ChartWrapper>
				</View>
			)}
			keyExtractor={(item) => item.created_date}
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
							<IncomeCard
								key={transaction.id}
								data={transaction as any}
								category={transaction.category as schema.Category}
								accounts={transaction.accountName}
							/>
						))}
					</View>
				</View>
			)}
		/>
	);
}

