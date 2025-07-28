import React, { useEffect, useRef } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, FAB, Text, useTheme } from 'react-native-paper';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { HouseIcon, SettingsIcon } from 'lucide-react-native';

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

	// bottomsheet
	const screenHeights = Dimensions.get('window').height;
	const snapPoints = [screenHeights * 0.43, '93%'];
	const bottomSheetRef = useRef<BottomSheet>(null);

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
			<View
				style={[
					styles.headerContainer,
					{ backgroundColor: theme.colors.background },
				]}
			>
				<TransactionsSummaryChart transactions={transactions} />
			</View>

			<BottomSheet
				ref={bottomSheetRef}
				snapPoints={snapPoints}
				enableContentPanningGesture={false}
				enablePanDownToClose={false}
				overDragResistanceFactor={0.5}
				index={0}
				enableDynamicSizing={false}
				backgroundStyle={{
					backgroundColor: theme.colors.elevation.level1,
				}}
				handleIndicatorStyle={{
					backgroundColor: theme.colors.secondary,
				}}
			>
				<BottomSheetFlatList
					contentContainerStyle={{ paddingBottom: 180 }}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={<NoItemNotice />}
					data={groupedTransactionsByDate(transactions)}
					renderItem={({ item }) => (
						<View
							style={styles.transactionListContainer}
							key={item.created_date}
						>
							<Text style={styles.transactionListTitle} variant="bodyMedium">
								{item.created_date}
							</Text>

							<View style={{ gap: 2 }}>
								{item.transactions.map((data, index) => (
									<TransactionCard
										data={data}
										disableFirstButton={false}
										disableSecondButton={false}
										showDate={false}
										position={
											item.transactions.length === 1
												? 'only'
												: index > 0 && index < item.transactions.length - 1
													? 'middle'
													: index === 0
														? 'first'
														: 'last'
										}
									/>
								))}
							</View>
						</View>
					)}
				/>
			</BottomSheet>

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
		flex: 0.5,
		alignItems: 'center',
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
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 80,
	},
});

