import { useEffect, useState } from 'react';
import {
	CalendarFoldIcon,
	HouseIcon,
	PlusIcon,
	SettingsIcon,
} from 'lucide-react-native';
import { useNavigation, useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Divider, Surface, Text, useTheme } from 'react-native-paper';

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

	//   load the transactions data
	const { loadTransactionsData } = useTransactionsManager({});
	const { data: transactions } = useLiveQuery(loadTransactionsData());

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
			headerTitle: () => <MonthYearSelectorDialog />,
			headerRight: (props: any) => (
				<View
					style={{
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

