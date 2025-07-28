import { useEffect, useState } from 'react';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	SettingsIcon,
} from 'lucide-react-native';
import { useNavigation, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import HomeBottomSheets from '@/src/components/home/home-bottom-sheets';
import useTransactionsManager from '@/src/hooks/useTransactionsManager';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';
import MonthYearSelectorDialog from '@/src/components/reusables/month-year-selector-dialog';
import HomeHeaderContainer from '@/src/components/home/home-header-container';
import TransactionsSummary from '@/src/components/charts/transactions-summary';

export default function HomeMonthlyTransactionScreen() {
	const navigation = useNavigation();
	const router = useRouter();
	const theme = useTheme();
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	//   load the transactions data
	const { loadTransactionsDataDate } = useTransactionsManager({});
	const { data: transactions } = useLiveQuery(
		loadTransactionsDataDate(selectedDate, 'month'),
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

	useEffect(() => {
		navigation.setOptions({
			headerTitle: () => (
				<View style={{ flexDirection: 'row', gap: 2 }}>
					<MonthYearSelectorDialog
						onValueChange={setSelectedDate}
						selectedValue={selectedDate}
					/>
					<Button
						compact
						mode="contained-tonal"
						contentStyle={{ height: 40 }}
						style={{
							borderTopRightRadius: 6,
							borderBottomRightRadius: 6,
						}}
						onPress={goToPreviousMonth}
					>
						<ChevronLeftIcon
							size={20}
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
						/>
					</Button>
					<Button
						compact
						mode="contained-tonal"
						contentStyle={{ height: 40 }}
						style={{
							borderTopLeftRadius: 6,
							borderBottomLeftRadius: 6,
						}}
						onPress={gotToNextMonth}
					>
						<ChevronRightIcon
							size={20}
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
						/>
					</Button>
				</View>
			),
			headerRight: () => (
				<Button
					mode="contained-tonal"
					onPress={() => router.push('/(root)/settings')}
					contentStyle={{ height: 40 }}
					style={{ marginRight: 16 }}
				>
					<SettingsIcon
						strokeWidth={1.5}
						color={theme.colors.onSecondaryContainer}
						size={20}
					/>
				</Button>
			),
		});
	}, [theme, selectedDate]);

	return (
		<View style={{ flex: 1 }}>
			<HomeHeaderContainer>
				<TransactionsSummaryChart transactions={transactions} />
				<TransactionsSummary />
			</HomeHeaderContainer>

			<HomeBottomSheets transactions={transactions} />
		</View>
	);
}

