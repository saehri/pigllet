import { View } from 'react-native';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import moment from 'moment';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';

import YearSelectorDialog from '@/src/components/reusables/year-selector-dialog';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';
import HomeBottomSheets from '@/src/components/home/home-bottom-sheets';
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
		<View style={{ flex: 1 }}>
			<HomeHeaderContainer>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						paddingHorizontal: 16,
						alignItems: 'center',
						height: 40,
					}}
				>
					<Text style={{ fontFamily: 'Manrope-Medium' }} variant="titleLarge">
						{moment(selectedDate).format('YYYY')}
					</Text>

					<View style={{ flexDirection: 'row' }}>
						<Button
							compact
							mode="contained-tonal"
							contentStyle={{ height: 40 }}
							style={{
								borderTopRightRadius: 6,
								borderBottomRightRadius: 6,
								marginRight: 2,
								backgroundColor: theme.colors.elevation.level2,
							}}
							onPress={goToPreviousYear}
						>
							<ChevronLeftIcon
								size={20}
								strokeWidth={1.5}
								color={theme.colors.onSurface}
							/>
						</Button>
						<Button
							compact
							mode="contained-tonal"
							contentStyle={{ height: 40 }}
							style={{
								borderTopLeftRadius: 6,
								borderBottomLeftRadius: 6,
								backgroundColor: theme.colors.elevation.level2,
							}}
							onPress={gotToNextYear}
						>
							<ChevronRightIcon
								size={20}
								strokeWidth={1.5}
								color={theme.colors.onSurface}
							/>
						</Button>

						<YearSelectorDialog
							onValueChange={setSelectedDate}
							selectedValue={selectedDate}
						/>
					</View>
				</View>

				<TransactionsSummaryChart
					transactions={transactions}
					dateFormat="MMM, YYYY"
				/>
				<TransactionsSummary selectedDate={selectedDate} range="year" />
			</HomeHeaderContainer>

			<HomeBottomSheets
				transactions={groupedTransactionsByDate(transactions, 'MMMM, YYYY')}
			/>
		</View>
	);
}

