import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FAB, Text, useTheme } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { loadBudgetRecord } from '@/src/hooks/useBudgetManager';

import { getCardPosition } from '@/utils/utils';

import BudgetCard from '@/src/components/budgets/budget-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import BudgetHeaderBar from '@/src/components/budgets/budget-header-bar';
import BudgetBigTotals from '@/src/components/budgets/budget-big-totals';
import MonthSelectorBar from '@/src/components/reusables/month-selector-bar';
import BudgetActualVsPlanned from '@/src/components/budgets/budget-actual-vs-planned';

export default function BudgetScreen() {
	const theme = useTheme();
	const router = useRouter();

	const [selectedDate, setSelectedDate] = useState(new Date());

	const updateMonth = useCallback((offset: number) => {
		setSelectedDate((prev) => {
			const updated = new Date(prev);
			updated.setMonth(prev.getMonth() + offset);
			return updated;
		});
	}, []);

	const { data: budgets } = useLiveQuery(loadBudgetRecord(selectedDate), [
		selectedDate,
	]);

	const renderHeader = useCallback(() => {
		const budgetIds = budgets.map((b) => b.budget.category_id);

		return (
			<View style={{ paddingTop: 4, gap: 8 }}>
				<View style={{ paddingHorizontal: 16 }}>
					<MonthSelectorBar
						onNext={() => updateMonth(1)}
						onPrev={() => updateMonth(-1)}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						showAdvanceDataSelector={false}
					/>
				</View>

				<View style={styles.headerContainer}>
					<Text variant="titleLarge" style={styles.headerTitle}>
						Statistics
					</Text>

					<View style={styles.statsContainer}>
						<BudgetBigTotals
							selectedDate={selectedDate}
							budgetIds={budgetIds}
						/>
						<BudgetActualVsPlanned
							budgets={budgets}
							selectedDate={selectedDate}
						/>
					</View>
				</View>

				<BudgetHeaderBar />
			</View>
		);
	}, [budgets, selectedDate]);

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
	headerContainer: {
		paddingHorizontal: 16,
		gap: 12,
	},
	headerTitle: {
		fontFamily: 'Manrope-Regular',
	},
	statsContainer: {
		gap: 4,
	},
});

