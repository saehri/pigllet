import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, eq } from 'drizzle-orm';

import * as schema from '@/db/schema';

import ExpenseCard from '@/src/components/reusables/expense-card';

export default function TransactionScreen(props: any) {
	const theme = useTheme();
	const [date] = useState(new Date());

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { data } = useLiveQuery(
		drizzleDb
			.select()
			.from(schema.expenses)
			.where(
				and(
					eq(schema.expenses.created_month, date.getMonth()),
					eq(schema.expenses.created_year, date.getFullYear())
				)
			)
			.innerJoin(
				schema.expenseCategories,
				eq(schema.expenses.category_id, schema.expenseCategories.id)
			)
			.innerJoin(
				schema.accounts,
				eq(schema.expenses.account_id, schema.accounts.id)
			)
	);

	if (!data.length)
		return (
			<View
				style={{
					paddingHorizontal: 16,
					paddingTop: 60,
					backgroundColor: theme.colors.background,
				}}
			>
				<Text
					variant="bodyLarge"
					style={{ fontFamily: 'Inter-Regular', textAlign: 'center' }}
				>
					There are no records of expense yet.
				</Text>
			</View>
		);

	return (
		<FlatList
			style={{ paddingTop: 60, backgroundColor: theme.colors.background }}
			data={data}
			renderItem={({ item }) => (
				<ExpenseCard
					key={item.expenses.id}
					data={item.expenses as schema.Expense}
					account={item.accounts as schema.Accounts}
					category={item.expense_categories as schema.ExpenseCategory}
				/>
			)}
		/>
	);
}
