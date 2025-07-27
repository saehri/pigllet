import { Divider, Surface, Text, useTheme } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';

import TransactionCard from '@/src/components/reusables/transaction-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import useTransactionsManager from '@/src/hooks/useTransactionsManager';

export default function HomeMonthlyTransactionScreen() {
	const theme = useTheme();
	const { loadTransactionsData } = useTransactionsManager({});

	const { data: transactions } = useLiveQuery(loadTransactionsData());

	return (
		<FlatList
			style={{ backgroundColor: theme.colors.background }}
			showsVerticalScrollIndicator={false}
			data={groupedTransactionsByDate(transactions)}
			ListEmptyComponent={<NoItemNotice />}
			ListHeaderComponent={<View style={styles.headerContainer}></View>}
			renderItem={({ item }) => (
				<View style={styles.transactionListContainer}>
					<Text style={styles.transactionListTitle} variant="bodyMedium">
						{item.created_date}
					</Text>

					<Surface elevation={2} mode="flat" style={styles.transactionList}>
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
	container: {
		marginTop: 28,
		gap: 10,
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingRight: 13,
		marginTop: 16,
		paddingTop: 50,
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
		opacity: 0.5,
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

