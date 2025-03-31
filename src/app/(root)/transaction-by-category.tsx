import { FlatList, ScrollView, View } from 'react-native';
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Chip, Text } from 'react-native-paper';

import * as schema from '@/db/schema';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, desc, eq } from 'drizzle-orm';

import { groupedTransactionsByDate } from '@/utils/group-transactions';

import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';
import ChartWrapper from '@/src/components/charts/chart-wrapper';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';

type FilterTypes = 'all' | 'this-month' | 'this-year';

export default function TransactionByCategoryScreen() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const navigation = useNavigation();
	const { categoryId, categoryName } = useLocalSearchParams();

	const [filter, setFilter] = useState<FilterTypes>('this-month');

	const loadExpenseData = useCallback(
		(filter: FilterTypes, todayDate: Date) => {
			let query = drizzleDb
				.select({
					id: schema.transactions.id,
					amount: schema.transactions.amount,
					note: schema.transactions.note,
					account_id: schema.transactions.account_id,
					category_id: schema.transactions.category_id,
					type: schema.transactions.type,
					created_date: schema.transactions.created_date,
					created_month: schema.transactions.created_month,
					created_year: schema.transactions.created_year,
					category: schema.categories,
					account: schema.accounts,
					image: schema.transactions.image,
				})
				.from(schema.transactions)
				.innerJoin(
					schema.categories,
					eq(schema.transactions.category_id, schema.categories.id)
				)
				.innerJoin(
					schema.accounts,
					eq(schema.transactions.account_id, schema.accounts.id)
				)
				.orderBy(desc(schema.transactions.created_month));

			// Base filter by category ID
			let conditions = [
				eq(schema.transactions.category_id, Number(categoryId)),
			];

			if (filter === 'this-month') {
				conditions.push(
					eq(schema.transactions.created_month, todayDate.getMonth() + 1),
					eq(schema.transactions.created_year, todayDate.getFullYear())
				);
			} else if (filter !== 'all') {
				conditions.push(
					eq(schema.transactions.created_year, todayDate.getFullYear())
				);
			}

			return query.where(and(...conditions));
		},
		[drizzleDb]
	);

	const { data: transactions } = useLiveQuery(
		loadExpenseData(filter, new Date()),
		[filter]
	);

	useEffect(() => {
		navigation.setOptions({
			title: categoryName,
		});
	}, []);

	return (
		<FlatList
			ListHeaderComponent={() => (
				<View>
					<ListHeader setFilter={setFilter} selectedFilter={filter} />

					<View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
						<ChartWrapper>
							<TransactionsSummaryChart
								groupBy="date"
								transactions={transactions}
							/>
						</ChartWrapper>
					</View>
				</View>
			)}
			data={groupedTransactionsByDate(transactions as any)}
			ListEmptyComponent={<NoItemNotice />}
			renderItem={({ item }) => (
				<View style={{ paddingBottom: 18, gap: 8 }}>
					<Text
						style={{
							fontFamily: 'Inter-Regular',
							paddingHorizontal: 16,
							fontSize: 18,
						}}
					>
						{item.created_date}
					</Text>
					<View>
						{item.transactions.map((transaction) => (
							<TransactionCard
								key={transaction.id}
								account={transaction.account}
								category={transaction.category as any}
								data={transaction}
								transactionType={transaction.type as any}
								disableFirstButton
							/>
						))}
					</View>
				</View>
			)}
		/>
	);
}

type ListHeaderProps = {
	setFilter: Dispatch<SetStateAction<FilterTypes>>;
	selectedFilter: FilterTypes;
};

function ListHeader({ setFilter, selectedFilter }: ListHeaderProps) {
	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false}>
			<View
				style={{
					flexDirection: 'row',
					gap: 8,
					alignItems: 'center',
					paddingHorizontal: 16,
					paddingBottom: 24,
				}}
			>
				<Chip
					selected={selectedFilter === 'all'}
					style={{ borderRadius: 100 }}
					onPress={() => setFilter('all')}
					textStyle={{ fontFamily: 'Inter-Regular' }}
				>
					All
				</Chip>
				<Chip
					selected={selectedFilter === 'this-month'}
					style={{ borderRadius: 100 }}
					onPress={() => setFilter('this-month')}
					textStyle={{ fontFamily: 'Inter-Regular' }}
				>
					This month
				</Chip>
				<Chip
					selected={selectedFilter === 'this-year'}
					style={{ borderRadius: 100 }}
					onPress={() => setFilter('this-year')}
					textStyle={{ fontFamily: 'Inter-Regular' }}
				>
					This year
				</Chip>
			</View>
		</ScrollView>
	);
}
