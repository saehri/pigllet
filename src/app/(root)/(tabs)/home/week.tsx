import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { FAB, Text, useTheme } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import useScrollDirection from '@/src/hooks/useScrollDirection';
import { fastSpatialEasing, getCardPosition } from '@/utils/utils';
import { groupedTransactionsByDate } from '@/utils/group-transactions';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';

import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';
import WeekSelectorBar from '@/src/components/reusables/week-selector-bar';
import HomeHeaderContainer from '@/src/components/home/home-header-container';
import TransactionsSummary from '@/src/components/charts/transactions-summary';

export default function WeekTransactionScreen() {
	const theme = useTheme();
	const router = useRouter();
	const [selectedDate, setSelectedDate] = useState(new Date());
	const { direction, handleScroll } = useScrollDirection();
	const { data: transactions } = useLiveQuery(
		loadTransactionsData({ date: selectedDate, range: 'week' }),
		[selectedDate]
	);

	const updateWeek = useCallback((offset: number) => {
		setSelectedDate((prev) => {
			const updated = new Date(prev);
			updated.setDate(prev.getDate() + offset * 7);

			// Find Monday of this week (assuming Monday = 1, Sunday = 0)
			const day = updated.getDay();
			const diff = day === 0 ? -6 : 1 - day; // if Sunday, go back 6 days
			updated.setDate(updated.getDate() + diff);

			return updated;
		});
	}, []);

	const renderHeader = useCallback(() => {
		return (
			<HomeHeaderContainer>
				<WeekSelectorBar
					onNext={() => updateWeek(1)}
					onPrev={() => updateWeek(-1)}
					selectedDate={selectedDate}
				/>
				<TransactionsSummary range="week" selectedDate={selectedDate} />
				<Text variant="titleLarge" style={styles.transactionsTitle}>
					Transactions
				</Text>
			</HomeHeaderContainer>
		);
	}, [selectedDate, updateWeek]);

	const renderTransactionGroup = useCallback(
		({ item }: any) => (
			<View style={styles.transactionListContainer}>
				<Text style={styles.transactionListTitle} variant="bodySmall">
					{item.created_date}
				</Text>
				<View style={{ gap: 2 }}>
					{item.transactions.map((data: any, index: number) => (
						<TransactionCard
							key={data.transaction.id}
							data={data}
							showDate={false}
							position={getCardPosition(index, item.transactions.length)}
						/>
					))}
				</View>
			</View>
		),
		[]
	);

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
						onPress={() => router.push('/(root)/new-transactions/expense')}
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
				ListHeaderComponent={renderHeader}
				style={{ backgroundColor: theme.colors.background }}
				contentContainerStyle={{ paddingBottom: transactions.length ? 80 : 0 }}
				ListEmptyComponent={<NoItemNotice />}
				showsVerticalScrollIndicator={false}
				data={groupedTransactionsByDate(transactions as any, 'MMM D, YYYY')}
				renderItem={renderTransactionGroup}
			/>

			{renderFab()}
		</>
	);
}

const styles = StyleSheet.create({
	transactionListTitle: {
		fontFamily: 'Manrope-Light',
		opacity: 0.7,
	},
	transactionsTitle: {
		fontFamily: 'Manrope-Regular',
		marginTop: 16,
		marginBottom: 4,
	},
	transactionListContainer: {
		paddingHorizontal: 16,
		paddingBottom: 12,
		gap: 8,
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 80,
	},
});

