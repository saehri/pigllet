import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB, Text, useTheme } from 'react-native-paper';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { loadBudgetRecord } from '@/src/hooks/useBudgetManager';

import BudgetCard from '@/src/components/budgets/budget-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';

import MonthSelectorBar from '@/src/components/reusables/month-selector-bar';
import { getCardPosition } from '@/utils/utils';
import BudgetHeaderBar from '@/src/components/budgets/budget-header-bar';
import BudgetStatistics from '@/src/components/budgets/budget-statistics';

export default function BudgetScreen() {
	const theme = useTheme();
	const router = useRouter();

	const [selectedDate, setSelectedDate] = useState(new Date());

	const { data: budgets } = useLiveQuery(loadBudgetRecord());

	const updateMonth = useCallback((offset: number) => {
		setSelectedDate((prev) => {
			const updated = new Date(prev);
			updated.setMonth(prev.getMonth() + offset);
			return updated;
		});
	}, []);

	const renderHeader = useCallback(() => {
		return (
			<View style={{ paddingTop: 4, gap: 8 }}>
				<MonthSelectorBar
					onNext={() => updateMonth(1)}
					onPrev={() => updateMonth(-1)}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>
				<BudgetStatistics />
				<BudgetHeaderBar />
			</View>
		);
	}, [selectedDate, updateMonth]);

	return (
		<>
			<FlatList
				data={budgets}
				showsVerticalScrollIndicator={false}
				style={{
					backgroundColor: theme.colors.background,
				}}
				contentContainerStyle={{
					paddingBottom: budgets.length ? 180 : 0,
				}}
				ListEmptyComponent={<NoItemNotice />}
				ListHeaderComponent={renderHeader}
				renderItem={({ item, index }) => (
					<BudgetCard
						key={item.budget.id}
						data={item}
						position={getCardPosition(index, budgets.length)}
					/>
				)}
				keyExtractor={(item) => item.budget.id.toString()}
			/>

			<FAB
				icon="plus"
				style={styles.fab}
				onPress={() => router.push('/(root)/new-budget')}
				mode="flat"
				variant="secondary"
				size="medium"
			/>
		</>
	);
}

const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 80,
	},
});

