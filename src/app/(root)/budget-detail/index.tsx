import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { PencilIcon, Trash2Icon } from 'lucide-react-native';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

import { getCardPosition } from '@/utils/utils';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';

import useBudgetManager from '@/src/hooks/useBudgetManager';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import BudgetBigTotals from '@/src/components/budgets/budget-big-totals';
import TransactionCard from '@/src/components/reusables/transaction-card';
import { groupedTransactionsByDate } from '@/utils/group-transactions';

export default function BudgetDetail() {
	const theme = useTheme();
	const navigation = useNavigation();
	const {
		id: budgetId,
		categoryId,
		budgetPeriod,
		budgetLimit,
	} = useLocalSearchParams();

	const { data: transactions } = useLiveQuery(
		loadTransactionsData({
			date: budgetPeriod,
			transactionType: 'expense',
			categoryId: Number(categoryId),
		})
	);

	useEffect(() => {
		navigation.setOptions({
			title: '',
			headerRight: () => (
				<View style={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
					<DeleteBudgetDialog budgetId={Number(budgetId)} />

					<Link
						href={{
							pathname: '/edit-budget',
							params: { id: budgetId, budgetLimit },
						}}
					>
						<Button
							compact
							mode="contained-tonal"
							style={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
						>
							<PencilIcon
								color={theme.colors.onSecondaryContainer}
								size={20}
								strokeWidth={1.5}
							/>
						</Button>
					</Link>
				</View>
			),
		});
	}, [theme]);

	const renderHeader = useCallback(() => {
		return (
			<View style={{ paddingTop: 4, gap: 8 }}>
				<View style={styles.headerContainer}>
					<Text variant="titleLarge" style={styles.headerTitle}>
						Statistics
					</Text>

					<View style={styles.statsContainer}>
						<BudgetBigTotals
							budgetIds={[Number(budgetId)]}
							selectedDate={budgetPeriod}
							transactionCategoryIds={[Number(categoryId)]}
						/>
					</View>
				</View>

				<Text variant="titleLarge" style={styles.budgetTitle}>
					Transactions
				</Text>
			</View>
		);
	}, [transactions]);

	const renderTransactionGroup = useCallback(
		({ item }: any) => (
			<View style={styles.transactionListContainer}>
				<Text style={styles.transactionListTitle} variant="bodySmall">
					{item.created_date}
				</Text>
				<View style={{ gap: 2 }}>
					{item.transactions.map((data: any, index: number) => (
						<TransactionCard
							key={data.transaction.id}
							data={data}
							showDate={false}
							position={getCardPosition(index, item.transactions.length)}
						/>
					))}
				</View>
			</View>
		),
		[]
	);

	return (
		<FlatList
			keyboardShouldPersistTaps="handled"
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 180, gap: 2 }}
			data={groupedTransactionsByDate(transactions as any, 'MMM D, YYYY')}
			ListHeaderComponent={renderHeader}
			ListEmptyComponent={<NoItemNotice />}
			renderItem={renderTransactionGroup}
		/>
	);
}

type DeleteBudgetDialog = { budgetId: number };

function DeleteBudgetDialog({ budgetId }: DeleteBudgetDialog) {
	const theme = useTheme();
	const { loading, deleteBudgetRecord } = useBudgetManager();

	const [visible, setVisible] = useState<boolean>(false);

	const openDialog = () => setVisible(true);
	const closeDialog = () => setVisible(false);

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={closeDialog}>
					<Dialog.Icon
						icon={(props) => (
							<Trash2Icon
								color={props.color}
								size={props.size}
								strokeWidth={1.5}
							/>
						)}
					/>
					<Dialog.Title style={styles.dialogTitleStyle}>
						Delete budget record?
					</Dialog.Title>

					<Dialog.Actions>
						<Button
							onPress={closeDialog}
							disabled={loading}
							labelStyle={styles.dialogContentTextStyle}
						>
							Cancel
						</Button>

						<Button
							labelStyle={styles.dialogContentTextStyle}
							onPress={() => deleteBudgetRecord(budgetId)}
							disabled={loading}
							loading={loading}
						>
							Delete
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

			<Button
				onPress={openDialog}
				mode="contained-tonal"
				style={{
					height: 40,
					borderTopRightRadius: 6,
					borderBottomRightRadius: 6,
				}}
				compact
			>
				<Trash2Icon
					strokeWidth={1.5}
					color={theme.colors.onSecondaryContainer}
					size={20}
				/>
			</Button>
		</>
	);
}

const styles = StyleSheet.create({
	dialogContentTextStyle: {
		fontFamily: 'Manrope-Regular',
		fontSize: 16,
	},
	dialogTitleStyle: {
		fontFamily: 'Manrope-Regular',
		textAlign: 'center',
	},
	headerContainer: {
		paddingHorizontal: 16,
		gap: 12,
	},
	headerTitle: {
		fontFamily: 'Manrope-Regular',
	},
	budgetTitle: {
		fontFamily: 'Manrope-Regular',
		marginTop: 16,
		marginBottom: 8,
		marginHorizontal: 16,
	},
	statsContainer: {
		gap: 4,
	},
	inputContainer: {
		gap: 8,
	},
	inputLabel: {
		fontFamily: 'Manrope-Regular',
	},
	transactionListTitle: {
		fontFamily: 'Manrope-Light',
		opacity: 0.7,
	},
	transactionsTitle: {
		fontFamily: 'Manrope-Regular',
		marginTop: 16,
		marginBottom: 4,
	},
	transactionListContainer: {
		paddingHorizontal: 16,
		paddingBottom: 12,
		gap: 8,
	},
});

