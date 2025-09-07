import { useCallback } from 'react';
import { FlatList } from 'react-native';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { getCardPosition } from '@/utils/utils';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';
import useScrollDirection from '@/src/hooks/useScrollDirection';
import { useSelectedCategory } from '@/store/useSelectedCategory';

import CategoryFab from '@/src/components/reusables/category-fab';
import TransactionCategoryCard from '@/src/components/reusables/transaction-category-card';

export default function ExpenseCategories() {
	const drizzleDb = useDrizzleDB();
	const selectedCategories = useSelectedCategory((s) => s.selectedCategories);
	const { direction, handleScroll } = useScrollDirection();

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
		getTransactionCategories('income')
	);

	return (
		<>
			<FlatList
				onScroll={handleScroll}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 30,
					gap: 2,
					paddingTop: selectedCategories.length ? 0 : 60,
				}}
				data={expenseCategories}
				renderItem={({ item, index }) => (
					<TransactionCategoryCard
						data={item}
						position={getCardPosition(index, expenseCategories.length)}
					/>
				)}
			/>

			<CategoryFab direction={direction} categType="income" />
		</>
	);
}

