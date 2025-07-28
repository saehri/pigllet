import React, { useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import {
	Button,
	Divider,
	FAB,
	Surface,
	Text,
	useTheme,
} from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';
import { HouseIcon, PlusIcon, SettingsIcon } from 'lucide-react-native';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';

import TransactionCard from '@/src/components/reusables/transaction-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import useTransactionsManager from '@/src/hooks/useTransactionsManager';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';

export default function HomeScreen() {
	const navigation = useNavigation();
	const router = useRouter();
	const theme = useTheme();

	const { loadTransactionsData } = useTransactionsManager({});

	const { data: transactions } = useLiveQuery(loadTransactionsData());

	useEffect(() => {
		navigation.setOptions({
			title: 'All',
			headerTitle: () => (
				<Text
					style={{
						fontFamily: 'Manrope-Bold',
						letterSpacing: -1,
						fontSize: 20,
					}}
				>
					All transactions
				</Text>
			),
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
	}, [theme]);

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
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 80,
	},
});

