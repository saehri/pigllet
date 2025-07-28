import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Button, Text, useTheme } from 'react-native-paper';
import { HouseIcon, SettingsIcon } from 'lucide-react-native';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { groupedTransactionsByDate } from '@/utils/group-transactions';

import useTransactionsManager from '@/src/hooks/useTransactionsManager';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';
import HomeBottomSheets from '@/src/components/home/home-bottom-sheets';
import HomeHeaderContainer from '@/src/components/home/home-header-container';
import TransactionsSummary from '@/src/components/charts/transactions-summary';

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
			<HomeHeaderContainer>
				<TransactionsSummaryChart
					transactions={transactions}
					dateFormat="YYYY"
				/>
				<TransactionsSummary />
			</HomeHeaderContainer>

			<HomeBottomSheets
				transactions={groupedTransactionsByDate(transactions, 'YYYY')}
			/>
		</View>
	);
}

