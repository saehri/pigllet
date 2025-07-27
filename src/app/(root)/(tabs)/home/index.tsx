import { useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Button, Divider, Surface, Text, useTheme } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';

import TransactionCard from '@/src/components/reusables/transaction-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import useTransactionsManager from '@/src/hooks/useTransactionsManager';
import { HouseIcon, PlusIcon, SettingsIcon } from 'lucide-react-native';

export default function HomeScreen() {
	const navigation = useNavigation();
	const router = useRouter();
	const theme = useTheme();

	const { loadTransactionsData } = useTransactionsManager({});

	const { data: transactions } = useLiveQuery(loadTransactionsData());

	useEffect(() => {
		navigation.setOptions({
			title: 'All',
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
				<Text
					variant="titleLarge"
					style={{ fontFamily: 'Manrope-Bold', letterSpacing: -1 }}
				>
					Pigllet
				</Text>
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
							color={theme.colors.onBackground}
							size={24}
						/>
					</Button>

					<Button
						mode="contained-tonal"
						onPress={() => router.push('/(root)/settings')}
						contentStyle={{ height: 40 }}
					>
						<SettingsIcon
							strokeWidth={1.5}
							color={theme.colors.onBackground}
							size={20}
						/>
					</Button>
				</View>
			),
		});
	}, []);

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
		paddingHorizontal: 16,
		paddingTop: 60,
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

