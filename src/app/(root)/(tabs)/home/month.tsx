import { useRouter } from 'expo-router';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useState, useMemo, useCallback } from 'react';
import { FAB, Text, useTheme } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import useScrollDirection from '@/src/hooks/useScrollDirection';
import { fastSpatialEasing, getCardPosition } from '@/utils/utils';
import { groupedTransactionsByDate } from '@/utils/group-transactions';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';

import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';
import MonthSelectorBar from '@/src/components/reusables/month-selector-bar';
import HomeHeaderContainer from '@/src/components/home/home-header-container';
import TransactionsSummary from '@/src/components/charts/transactions-summary';

export default function HomeMonthlyTransactionScreen() {
	const theme = useTheme();
	const router = useRouter();
	const { direction, handleScroll } = useScrollDirection();

	const [selectedDate, setSelectedDate] = useState(() => new Date());

	const { data: transactions } = useLiveQuery(
		loadTransactionsData({
			date: selectedDate,
			range: 'month',
		}),
		[selectedDate]
	);

	const groupedTransactions = useMemo(() => {
		return groupedTransactionsByDate(transactions as any, 'MMMM D, YYYY');
	}, [transactions]);

	const updateMonth = useCallback((offset: number) => {
		setSelectedDate((prev) => {
			const updated = new Date(prev);
			updated.setMonth(prev.getMonth() + offset);
			return updated;
		});
	}, []);

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

	const renderHeader = useCallback(() => {
		return (
			<HomeHeaderContainer>
				<MonthSelectorBar
					onNext={() => updateMonth(1)}
					onPrev={() => updateMonth(-1)}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>

				<TransactionsSummary selectedDate={selectedDate} range="month" />

				<Text variant="titleLarge" style={styles.transactionsTitle}>
					Transactions
				</Text>
			</HomeHeaderContainer>
		);
	}, [selectedDate, updateMonth]);

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
				data={groupedTransactions}
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: theme.colors.background }}
				contentContainerStyle={{ paddingBottom: transactions.length ? 100 : 0 }}
				ListEmptyComponent={<NoItemNotice />}
				ListHeaderComponent={renderHeader}
				renderItem={renderTransactionGroup}
				keyExtractor={(item) => item.created_date}
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

