import { useEffect, useState } from 'react';
import { PlusIcon, SettingsIcon } from 'lucide-react-native';
import { useNavigation, useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Divider, Surface, Text, useTheme } from 'react-native-paper';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';

import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';
import YearSelectorDialog from '@/src/components/reusables/year-selector-dialog';
import useTransactionsManager from '@/src/hooks/useTransactionsManager';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';

export default function HomeYearlyTransactionScreen() {
	const theme = useTheme();
	const router = useRouter();
	const navigation = useNavigation();

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	//   load the transactions data
	const { loadTransactionsDataDate } = useTransactionsManager({});
	const { data: transactions } = useLiveQuery(
		loadTransactionsDataDate(selectedDate, 'year'),
		[selectedDate]
	);

	useEffect(() => {
		navigation.setOptions({
			title: 'Yearly',
			headerTitle: () => (
				<YearSelectorDialog
					onValueChange={setSelectedDate}
					selectedValue={selectedDate}
				/>
			),
			headerRight: (props: any) => (
				<View
					style={{
						backgroundColor: theme.colors.background,
						paddingRight: 16,
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Button
						mode="contained-tonal"
						onPress={() => router.push('/(root)/new-transactions/expense')}
						contentStyle={{ height: 40 }}
					>
						<PlusIcon
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
							size={20}
						/>
					</Button>

					<Button
						mode="contained-tonal"
						onPress={() => router.push('/(root)/settings')}
						contentStyle={{ height: 40 }}
					>
						<SettingsIcon
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
							size={20}
						/>
					</Button>
				</View>
			),
		});
	}, [theme]);

	return (
		<FlatList
			style={{
				backgroundColor: theme.colors.elevation.level1,
			}}
			contentContainerStyle={{ paddingBottom: 70 }}
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
							height: 20,
							backgroundColor: theme.colors.elevation.level1,
							borderTopLeftRadius: 200,
							borderTopRightRadius: 200,
							position: 'absolute',
							bottom: 0,
							left: 0,
							width: '100%',
						}}
					></View>
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
											item.transactions.length - 1 === index ? 'none' : 'flex',
									}}
								/>
							</View>
						))}
					</Surface>
				</View>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		paddingTop: 70,
		paddingHorizontal: 16,
		paddingBottom: 50,
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
});

