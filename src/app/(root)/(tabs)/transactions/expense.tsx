import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, asc, eq } from 'drizzle-orm';

import * as schema from '@/db/schema';

import ExpenseCard from '@/src/components/reusables/expense-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';

export default function ExpensesScreen() {
	const theme = useTheme();
	const [date] = useState(new Date());

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { data } = useLiveQuery(
		drizzleDb
			.select()
			.from(schema.transactions)
			.where(
				and(
					eq(schema.transactions.type, 'expense'),
					eq(schema.transactions.created_month, date.getMonth()),
					eq(schema.transactions.created_year, date.getFullYear())
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
			.orderBy(asc(schema.transactions.created_date))
	);

	return (
		<FlatList
			style={{ paddingTop: 60, backgroundColor: theme.colors.background }}
			data={data}
			ListHeaderComponent={
				<View style={{ padding: 16 }}>
					<Text style={{ textAlign: 'center' }}>Analytics will be here</Text>
				</View>
			}
			ListEmptyComponent={<NoItemNotice />}
			renderItem={({ item }) => (
				<ExpenseCard
					key={item.transactions.id}
					data={item.transactions}
					account={item.accounts as schema.Accounts}
					category={item.categories as schema.TransactionCategories}
				/>
			)}
		/>
	);
}
