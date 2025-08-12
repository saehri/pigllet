import { useCallback } from 'react';
import { FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { getCardPosition } from '@/utils/utils';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import CategoryListHeader from '@/src/components/reusables/category-list-header';
import TransactionCategoryCard from '@/src/components/reusables/transaction-category-card';

export default function ExpenseCategories() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const getTransactionCategories = useCallback(
		(type: schema.TransactionType) => {
			return drizzleDb
				.select()
				.from(schema.categories)
				.where(eq(schema.categories.type, type));
		},
		[]
	);

	const { data: expenseCategories } = useLiveQuery(
		getTransactionCategories('expense')
	);

	return (
		<FlatList
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingTop: 60, paddingBottom: 140, gap: 2 }}
			data={expenseCategories}
			ListHeaderComponent={<CategoryListHeader />}
			renderItem={({ item, index }) => (
				<TransactionCategoryCard
					data={item}
					position={getCardPosition(index, expenseCategories.length)}
				/>
			)}
		/>
	);
}

