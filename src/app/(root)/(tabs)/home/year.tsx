import { useState } from 'react';
import { Text, useTheme } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';

import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';
import YearSelectorBar from '@/src/components/reusables/year-selector-bar';
import HomeHeaderContainer from '@/src/components/home/home-header-container';
import TransactionsSummary from '@/src/components/charts/transactions-summary';

export default function HomeYearlyTransactionScreen() {
	const theme = useTheme();

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	//   load the transactions data
	const { data: transactions } = useLiveQuery(
		loadTransactionsData(selectedDate, 'year'),
		[selectedDate]
	);

	function gotToNextYear() {
		const updatedDate = new Date(selectedDate);
		updatedDate.setFullYear(updatedDate.getFullYear() + 1); // Handles year rollover automatically
		setSelectedDate(updatedDate);
	}

	function goToPreviousYear() {
		const updatedDate = new Date(selectedDate);
		updatedDate.setFullYear(updatedDate.getFullYear() - 1); // Handles year rollover automatically
		setSelectedDate(updatedDate);
	}

	return (
		<FlatList
			ListHeaderComponent={() => (
				<HomeHeaderContainer>
					<YearSelectorBar
						onNext={gotToNextYear}
						onPrev={goToPreviousYear}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
					/>

					<TransactionsSummary selectedDate={selectedDate} range="year" />

					<Text
						variant="titleLarge"
						style={{
							marginLeft: 16,
							marginTop: 16,
							marginBottom: 12,
							fontFamily: 'Manrope-Regular',
						}}
					>
						Transactions
					</Text>
				</HomeHeaderContainer>
			)}
			style={{ backgroundColor: theme.colors.background }}
			contentContainerStyle={{ paddingBottom: transactions.length ? 180 : 0 }}
			ListEmptyComponent={<NoItemNotice />}
			showsVerticalScrollIndicator={false}
			data={groupedTransactionsByDate(transactions, 'MMMM, YYYY')}
			renderItem={({ item }) => (
				<View style={styles.transactionListContainer} key={item.created_date}>
					<Text style={styles.transactionListTitle} variant="bodySmall">
						{item.created_date}
					</Text>

					<View style={{ gap: 2 }}>
						{item.transactions.map((data, index) => (
							<TransactionCard
								key={data.transaction.id}
								data={data}
								showDate={false}
								position={
									item.transactions.length === 1
										? 'only'
										: index > 0 && index < item.transactions.length - 1
											? 'middle'
											: index === 0
												? 'first'
												: 'last'
								}
							/>
						))}
					</View>
				</View>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	transactionListTitle: {
		fontFamily: 'Manrope-Light',
		opacity: 0.7,
	},
	transactionListContainer: {
		paddingHorizontal: 16,
		paddingBottom: 12,
		gap: 8,
	},
});

