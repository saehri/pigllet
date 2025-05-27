import { FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import useBudgetManager from '@/src/hooks/useBudgetManager';

import BudgetCard from '@/src/components/budgets/budget-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';

export default function BudgetScreen() {
	const theme = useTheme();

	const { loadBudgetRecord } = useBudgetManager({ actionType: 'read' });
	const { data: budgets } = useLiveQuery(loadBudgetRecord());

	return (
		<FlatList
			showsVerticalScrollIndicator={false}
			style={{
				backgroundColor: theme.colors.background,
			}}
			ListEmptyComponent={<NoItemNotice />}
			data={budgets}
			renderItem={({ item }) => <BudgetCard key={item.id} data={item} />}
		/>
	);
}

