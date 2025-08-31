import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { AnimatedFAB, FAB, Text, useTheme } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { loadBudgetRecord } from '@/src/hooks/useBudgetManager';

import { getCardPosition } from '@/utils/utils';

import BudgetCard from '@/src/components/budgets/budget-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import BudgetTransactionHeaderBar from '@/src/components/budgets/budget-header-bar';
import BudgetBigTotals from '@/src/components/budgets/budget-big-totals';
import MonthSelectorBar from '@/src/components/reusables/month-selector-bar';
import BudgetActualVsPlanned from '@/src/components/budgets/budget-actual-vs-planned';

export default function BudgetScreen() {
	const theme = useTheme();
	const router = useRouter();

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [isExtended, setIsExtended] = useState(true);

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

	const onScroll = ({ nativeEvent }: any) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

		setIsExtended(currentScrollPosition <= 0);
	};

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

				<BudgetTransactionHeaderBar />
			</View>
		);
	}, [budgets, selectedDate]);

	return (
		<>
			<FlatList
				onScroll={onScroll}
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

			<AnimatedFAB
				icon="plus"
				style={styles.fab}
				onPress={() => router.push('/(root)/new-budget')}
				extended={isExtended}
				variant="secondary"
				label="Add budget"
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

