import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, desc, eq } from 'drizzle-orm';
import * as schema from '@/db/schema';

import groupedTransactions from '@/utils/group-transactions';

import IncomeCard from '@/src/components/reusables/income-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';

export default function IncomesScreen() {
	const theme = useTheme();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [todayDate] = useState<Date>(new Date());

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
				created_date: schema.transactions.created_date,
				created_month: schema.transactions.created_month,
				created_year: schema.transactions.created_year,
				budget_id: schema.transactions.budget_id,
				category: schema.categories,
				accounts: schema.accounts,
			})
			.from(schema.transactions)
			.where(
				and(
					eq(schema.transactions.type, 'income'),
					eq(schema.transactions.created_month, todayDate.getMonth() + 1),
					eq(schema.transactions.created_year, todayDate.getFullYear())
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
			.orderBy(desc(schema.transactions.created_date))
	);

	console.log(transactions);

	return (
		<FlatList
			style={{ paddingTop: 60, backgroundColor: theme.colors.background }}
			data={groupedTransactions(transactions)}
			ListEmptyComponent={<NoItemNotice />}
			renderItem={({ item }) => (
				<View style={{ paddingBottom: 24, gap: 8 }}>
					<Text
						style={{
							fontFamily: 'Inter-Regular',
							paddingHorizontal: 16,
							fontSize: 18,
						}}
					>
						{new Date(
							`${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${item.created_date}`
						).toLocaleDateString('en-US', {
							dateStyle: 'long',
							month: 'short',
						})}
					</Text>

					<View>
						{item.transactions.map((transaction: any) => (
							<IncomeCard
								key={transaction.id}
								data={transaction as any}
								category={transaction.category as schema.TransactionCategories}
								accounts={transaction.accounts}
								showsDate={false}
							/>
						))}
					</View>
				</View>
			)}
		/>
	);
}
