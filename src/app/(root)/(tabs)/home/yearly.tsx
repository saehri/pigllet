import { useEffect, useRef, useState } from 'react';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	SettingsIcon,
} from 'lucide-react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, FAB, Text, useTheme } from 'react-native-paper';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

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

	// bottomsheet
	const screenHeights = Dimensions.get('window').height;
	const snapPoints = [screenHeights * 0.43, '93%'];
	const bottomSheetRef = useRef<BottomSheet>(null);

	useEffect(() => {
		navigation.setOptions({
			title: 'Yearly',
			headerTitle: () => (
				<View style={{ flexDirection: 'row', gap: 2 }}>
					<YearSelectorDialog
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
						onPress={goToPreviousYear}
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
						onPress={gotToNextYear}
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
					keyExtractor={(i) => i.created_date}
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

