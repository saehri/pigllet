import { Text, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

import { GroupedTransactionByDateOutput } from '@/utils/group-transactions';

import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import TransactionCard from '../reusables/transaction-card';
import NoItemNotice from '../reusables/no-items-notice';

type Props = {
	transactions: GroupedTransactionByDateOutput[];
};

export default function HomeBottomSheets({ transactions }: Props) {
	const theme = useTheme();

	const snapPoints = ['30%', '93%'];

	return (
		<BottomSheet
			snapPoints={snapPoints}
			enableContentPanningGesture={false}
			enablePanDownToClose={false}
			overDragResistanceFactor={0.5}
			index={0}
			enableDynamicSizing={false}
			backgroundStyle={{
				backgroundColor: theme.colors.elevation.level2,
			}}
			handleIndicatorStyle={{
				backgroundColor: theme.colors.secondary,
				height: 6,
				width: 35,
			}}
		>
			<BottomSheetFlatList
				contentContainerStyle={{ paddingBottom: 180 }}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={<NoItemNotice />}
				data={transactions}
				renderItem={({ item }) => (
					<View style={styles.transactionListContainer} key={item.created_date}>
						<Text style={styles.transactionListTitle} variant="bodyMedium">
							{item.created_date}
						</Text>

						<View style={{ gap: 2 }}>
							{item.transactions.map((data, index) => (
								<TransactionCard
									key={data.transaction.id}
									data={data}
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
	);
}

const styles = StyleSheet.create({
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
});

