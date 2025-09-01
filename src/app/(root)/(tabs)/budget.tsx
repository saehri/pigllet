import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { FAB, Text, useTheme } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import useScrollDirection from '@/src/hooks/useScrollDirection';
import { loadBudgetRecord } from '@/src/hooks/useBudgetManager';
import { fastSpatialEasing, getCardPosition } from '@/utils/utils';

import BudgetCard from '@/src/components/budgets/budget-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import BudgetBigTotals from '@/src/components/budgets/budget-big-totals';
import MonthSelectorBar from '@/src/components/reusables/month-selector-bar';
import BudgetTransactionHeaderBar from '@/src/components/budgets/budget-header-bar';
import BudgetActualVsPlanned from '@/src/components/budgets/budget-actual-vs-planned';

export default function BudgetScreen() {
	const theme = useTheme();
	const router = useRouter();
	const { direction, handleScroll } = useScrollDirection();

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
		const budgetIds = budgets.map((b) => b.budget.id);
		const transactionCategoryIds = budgets.map((b) => b.category.id);

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
							transactionCategoryIds={transactionCategoryIds}
						/>
						<BudgetActualVsPlanned
							budgets={budgets}
							selectedDate={selectedDate}
						/>
					</View>
				</View>

				<Text variant="titleLarge" style={styles.budgetTitle}>
					Budgets
				</Text>
			</View>
		);
	}, [budgets, selectedDate]);

	const renderFab = useCallback(() => {
		if (direction === 'up')
			return (
				<Animated.View
					entering={FadeInDown.duration(500).easing(fastSpatialEasing)}
					exiting={FadeOutDown.duration(500).easing(fastSpatialEasing)}
				>
					<FAB
						icon="plus"
						size="medium"
						mode="flat"
						style={styles.fab}
						onPress={() => router.push('/(root)/new-budget')}
						variant="secondary"
					/>
				</Animated.View>
			);

		return <></>;
	}, [direction]);

	return (
		<>
			<FlatList
				onScroll={handleScroll}
				data={budgets}
				showsVerticalScrollIndicator={false}
				style={{
					backgroundColor: theme.colors.background,
				}}
				contentContainerStyle={{
					paddingBottom: budgets.length ? 150 : 0,
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

			{renderFab()}
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
	budgetTitle: {
		fontFamily: 'Manrope-Regular',
		marginTop: 16,
		marginBottom: 12,
		marginHorizontal: 16,
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

