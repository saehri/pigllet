import { useState } from 'react';
import { FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, asc, eq } from 'drizzle-orm';

import * as schema from '@/db/schema';

import IncomeCard from '@/src/components/reusables/income-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';

export default function IncomesScreen() {
	const theme = useTheme();
	const [date] = useState(new Date());

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { data } = useLiveQuery(
		drizzleDb
			.select({
				accounts: schema.accounts,
				categories: schema.categories,
				transactions: {
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
				},
			})
			.from(schema.transactions)
			.where(and(eq(schema.transactions.type, 'income')))
			.innerJoin(
				schema.categories,
				eq(schema.transactions.category_id, schema.categories.id)
			)
			.orderBy(asc(schema.transactions.created_date))
	);

	return (
		<FlatList
			style={{ paddingTop: 60, backgroundColor: theme.colors.background }}
			data={data}
			ListEmptyComponent={<NoItemNotice />}
			renderItem={({ item }) => (
				<IncomeCard
					key={item.transactions.id}
					data={item.transactions}
					accounts={item.accounts}
					category={item.categories}
				/>
			)}
		/>
	);
}
