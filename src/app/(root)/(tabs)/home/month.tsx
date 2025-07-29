import { useState } from 'react';
import { View } from 'react-native';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';
import { groupedTransactionsByDate } from '@/utils/group-transactions';

import HomeBottomSheets from '@/src/components/home/home-bottom-sheets';
import MonthSelectorBar from '@/src/components/reusables/month-selector-bar';
import HomeHeaderContainer from '@/src/components/home/home-header-container';
import TransactionsSummary from '@/src/components/charts/transactions-summary';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';

export default function HomeMonthlyTransactionScreen() {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	//   load the transactions data
	const { data: transactions } = useLiveQuery(
		loadTransactionsData(selectedDate, 'month'),
		[selectedDate]
	);

	function gotToNextMonth() {
		const updatedDate = new Date(selectedDate);
		updatedDate.setMonth(updatedDate.getMonth() + 1); // Handles year rollover automatically
		setSelectedDate(updatedDate);
	}

	function goToPreviousMonth() {
		const updatedDate = new Date(selectedDate);
		updatedDate.setMonth(updatedDate.getMonth() - 1); // Handles year rollover automatically
		setSelectedDate(updatedDate);
	}

	return (
		<View style={{ flex: 1 }}>
			<HomeHeaderContainer>
				<MonthSelectorBar
					onNext={gotToNextMonth}
					onPrev={goToPreviousMonth}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>

				<TransactionsSummaryChart
					transactions={transactions}
					dateFormat="MMM D, YYYY"
				/>
				<TransactionsSummary selectedDate={selectedDate} range="month" />
			</HomeHeaderContainer>

			<HomeBottomSheets
				transactions={groupedTransactionsByDate(transactions, 'MMMM D, YYYY')}
			/>
		</View>
	);
}

