import { useState } from 'react';
import { FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, eq } from 'drizzle-orm';

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
			.select()
			.from(schema.incomes)
			.where(
				and(
					eq(schema.incomes.created_month, date.getMonth()),
					eq(schema.incomes.created_year, date.getFullYear())
				)
			)
			.innerJoin(
				schema.incomeCategories,
				eq(schema.incomes.category_id, schema.incomeCategories.id)
			)
			.innerJoin(
				schema.accounts,
				eq(schema.incomes.to_account_id, schema.accounts.id)
			)
	);

	return (
		<FlatList
			style={{ paddingTop: 60, backgroundColor: theme.colors.background }}
			data={data}
			ListEmptyComponent={<NoItemNotice />}
			renderItem={({ item }) => (
				<IncomeCard
					key={item.incomes.id}
					data={item.incomes}
					account={item.accounts}
					category={item.income_categories}
				/>
			)}
		/>
	);
}
