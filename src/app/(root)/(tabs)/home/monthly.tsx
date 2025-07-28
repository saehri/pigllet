import { useEffect, useState } from 'react';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	HouseIcon,
	SettingsIcon,
} from 'lucide-react-native';
import { useNavigation, useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import {
	Button,
	Divider,
	FAB,
	Surface,
	Text,
	useTheme,
} from 'react-native-paper';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';

import TransactionCard from '@/src/components/reusables/transaction-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import useTransactionsManager from '@/src/hooks/useTransactionsManager';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';
import MonthYearSelectorDialog from '@/src/components/reusables/month-year-selector-dialog';

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
			title: 'Monthly',
			tabBarIcon: (props: any) => (
				<HouseIcon
					size={20}
					color={props.color}
					strokeWidth={1.5}
					fillOpacity={props.focused ? 0.3 : 0}
					fill={
						props.focused ? theme.colors.onPrimary : theme.colors.background
					}
				/>
			),
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
			<FlatList
				style={{
					backgroundColor: theme.colors.elevation.level1,
				}}
				contentContainerStyle={{ paddingBottom: 180 }}
				showsVerticalScrollIndicator={false}
				data={groupedTransactionsByDate(transactions)}
				ListEmptyComponent={<NoItemNotice />}
				ListHeaderComponent={
					<View>
						<View
							style={[
								styles.headerContainer,
								{ backgroundColor: theme.colors.background },
							]}
						>
							<TransactionsSummaryChart transactions={transactions} />
						</View>

						<View
							style={{
								backgroundColor: theme.colors.elevation.level1,
								borderTopLeftRadius: 30,
								borderTopRightRadius: 30,
								position: 'absolute',
								bottom: 0,
								left: 0,
								width: '100%',
								paddingHorizontal: 16,
								paddingTop: 20,
								paddingBottom: 16,
							}}
						>
							<Text
								variant="titleLarge"
								style={{ fontFamily: 'Manrope-SemiBold' }}
							>
								Transactions
							</Text>
						</View>
					</View>
				}
				renderItem={({ item }) => (
					<View style={styles.transactionListContainer}>
						<Text style={styles.transactionListTitle} variant="bodyMedium">
							{item.created_date}
						</Text>

						<Surface elevation={3} mode="flat" style={styles.transactionList}>
							{item.transactions.map((data, index) => (
								<View key={data.transaction.id}>
									<TransactionCard
										data={data}
										disableFirstButton={false}
										disableSecondButton={false}
										showDate={false}
									/>
									<Divider
										style={{
											display:
												item.transactions.length - 1 === index
													? 'none'
													: 'flex',
										}}
									/>
								</View>
							))}
						</Surface>
					</View>
				)}
			/>

			<FAB
				icon="plus"
				style={styles.fab}
				onPress={() => router.push('/(root)/new-transactions/expense')}
				mode="flat"
				variant="secondary"
				size="medium"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		paddingTop: 70,
		paddingHorizontal: 16,
		paddingBottom: 100,
	},
	title: {
		fontFamily: 'Manrope-Regular',
		lineHeight: 23,
	},
	subtitle: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.8,
		paddingHorizontal: 10,
		borderRadius: 100,
	},
	buttonContent: { flexDirection: 'row-reverse' },
	buttonLabel: { fontFamily: 'Manrope-Regular', fontSize: 16 },
	transactionListTitle: {
		fontFamily: 'Manrope-Bold',
		letterSpacing: -0.3,
		opacity: 0.6,
	},
	transactionListContainer: {
		paddingHorizontal: 16,
		paddingBottom: 12,
		gap: 8,
	},
	transactionList: {
		borderRadius: 16,
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 80,
	},
});

