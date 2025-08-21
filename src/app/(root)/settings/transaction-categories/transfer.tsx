import { useCallback } from 'react';
import { FlatList } from 'react-native';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { getCardPosition } from '@/utils/utils';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

import CategoryListHeader from '@/src/components/reusables/category-list-header';
import TransactionCategoryCard from '@/src/components/reusables/transaction-category-card';
import CategoryFab from '@/src/components/reusables/category-fab';

export default function ExpenseCategories() {
	const drizzleDb = useDrizzleDB();

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
		getTransactionCategories('transfer')
	);

	return (
		<>
			<FlatList
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 140, gap: 2 }}
				data={expenseCategories}
				ListHeaderComponent={
					<CategoryListHeader defaultCategoryLabel="Other Transfer" />
				}
				renderItem={({ item, index }) => (
					<TransactionCategoryCard
						data={item}
						position={getCardPosition(index, expenseCategories.length)}
					/>
				)}
			/>

			<CategoryFab categType="transfer" />
		</>
	);
}

