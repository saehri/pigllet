import { useCallback, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import * as schema from '@/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';

import { groupedTransactionsByDate } from '@/utils/group-transactions';

import ChartHeader from '@/src/components/charts/chart-header';
import ChartFooter from '@/src/components/charts/chart-footer';
import ChartWrapper from '@/src/components/charts/chart-wrapper';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';
import TransferCard from '@/src/components/reusables/transfer-card';
import { alias } from 'drizzle-orm/sqlite-core';
import { toYYYYMMDD } from '@/utils/utils';

export default function TransfersScreen() {
	const theme = useTheme();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [quickFilter, setQuickFilter] = useState('today');

	const loadExpenseData = (startDate: string, endDate: string) => {
		const relatedAccounts = alias(schema.accounts, 'related_accounts'); // Alias for related accounts

		return drizzleDb
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
				account: schema.accounts,
				related_account: relatedAccounts, // Use the alias here
			})
			.from(schema.transactions)
			.where(
				and(
					eq(schema.transactions.type, 'transfer'),
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
			.innerJoin(
				relatedAccounts, // Use the alias for the second join
				eq(schema.transactions.related_account_id, relatedAccounts.id)
			)
			.orderBy(desc(schema.transactions.created_at));
	};

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
							<TransferCard
								key={transaction.id}
								data={transaction as any}
								category={transaction.category as schema.Category}
								accounts={transaction.account}
								relatedAccount={transaction.related_account}
							/>
						))}
					</View>
				</View>
			)}
		/>
	);

	// const theme = useTheme();

	// const db = useSQLiteContext();
	// const drizzleDb = drizzle(db, { schema });

	// const [selectedYear, setSelectedYear] = useState<number>(
	// 	new Date().getFullYear()
	// );
	// const [selectedMonth, setSelectedMonth] = useState<{
	// 	value: number;
	// 	label: string;
	// }>({ value: new Date().getMonth(), label: '' });

	// const loadExpenseData = useCallback(
	// 	(year: number, month: number) => {
	// 		const relatedAccounts = alias(schema.accounts, 'related_accounts'); // Alias for related accounts

	// 		return drizzleDb
	// 			.select({
	// 				id: schema.transactions.id,
	// 				amount: schema.transactions.amount,
	// 				note: schema.transactions.note,
	// 				account_id: schema.transactions.account_id,
	// 				category_id: schema.transactions.category_id,
	// 				type: schema.transactions.type,
	// 				image: schema.transactions.image,
	// 				created_date: schema.transactions.created_date,
	// 				created_month: schema.transactions.created_month,
	// 				created_year: schema.transactions.created_year,
	// 				category: schema.categories,
	// 				account: schema.accounts,
	// 				related_account: relatedAccounts, // Use the alias here
	// 			})
	// 			.from(schema.transactions)
	// 			.where(
	// 				and(
	// 					eq(schema.transactions.type, 'transfer'),
	// 					eq(schema.transactions.created_month, month),
	// 					eq(schema.transactions.created_year, year)
	// 				)
	// 			)
	// 			.innerJoin(
	// 				schema.categories,
	// 				eq(schema.transactions.category_id, schema.categories.id)
	// 			)
	// 			.innerJoin(
	// 				schema.accounts,
	// 				eq(schema.transactions.account_id, schema.accounts.id)
	// 			)
	// 			.innerJoin(
	// 				relatedAccounts, // Use the alias for the second join
	// 				eq(schema.transactions.related_account_id, relatedAccounts.id)
	// 			)
	// 			.orderBy(desc(schema.transactions.created_date));
	// 	},
	// 	[drizzleDb]
	// );

	// const { data: transactions } = useLiveQuery(
	// 	loadExpenseData(selectedYear, selectedMonth.value + 1),
	// 	[selectedYear, selectedMonth]
	// );

	// return (
	// 	<FlatList
	// 		ListEmptyComponent={<NoItemNotice />}
	// 		style={{ backgroundColor: theme.colors.background }}
	// 		data={groupedTransactionsByDate(transactions as any)}
	// 		ListHeaderComponent={() => (
	// 			<View
	// 				style={{
	// 					paddingHorizontal: 16,
	// 					paddingBottom: 32,
	// 					paddingTop: 60,
	// 				}}
	// 			>
	// 				<ChartWrapper>
	// 					<ChartHeader
	// 						selectedYear={selectedYear}
	// 						setSelectedYear={setSelectedYear}
	// 						selectedMonth={selectedMonth.value + 1}
	// 					/>
	// 					<TransactionsSummaryChart
	// 						groupBy="category"
	// 						transactions={transactions as any}
	// 					/>
	// 					<ChartFooter
	// 						selectedMonth={selectedMonth}
	// 						setSelectedMonth={setSelectedMonth}
	// 					/>
	// 				</ChartWrapper>
	// 			</View>
	// 		)}
	// 		keyExtractor={(item) => item.created_date}
	// 		renderItem={({ item }) => (
	// 			<View style={{ paddingBottom: 18, gap: 8 }}>
	// 				<Text
	// 					style={{
	// 						fontFamily: 'Inter-Regular',
	// 						paddingHorizontal: 16,
	// 						fontSize: 18,
	// 					}}
	// 				>
	// 					{item.created_date}
	// 				</Text>
	// 				<View>
	// 					{item.transactions.map((transaction: any) => (
	// 						<TransferCard
	// 							key={transaction.id}
	// 							data={transaction as any}
	// 							category={transaction.category as schema.TransactionCategories}
	// 							accounts={transaction.account}
	// 							relatedAccount={transaction.related_account}
	// 						/>
	// 					))}
	// 				</View>
	// 			</View>
	// 		)}
	// 	/>
	// );
}

