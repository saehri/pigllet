import { FlatList, ScrollView, View } from 'react-native';
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import {
	useFocusEffect,
	useLocalSearchParams,
	useNavigation,
} from 'expo-router';
import { Button } from 'react-native-paper';

import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { and, eq } from 'drizzle-orm';

import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';

type Response = {
	accounts: schema.Accounts;
	categories: schema.TransactionCategories;
	transactions: schema.Transaction;
};

export default function TransactionByCategoryScreen() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const navigation = useNavigation();
	const { categoryId, categoryName } = useLocalSearchParams();

	const [filter, setFilter] = useState<'all' | 'this-month'>('this-month');
	const [todayDate] = useState(new Date());
	const [transactions, setTransactions] = useState<Response[]>();

	function fetcher(filter: 'all' | 'this-month') {
		if (filter === 'this-month') {
			return drizzleDb
				.select({
					accounts: schema.accounts,
					categories: schema.categories,
					transactions: {
						id: schema.transactions.id,
						amount: schema.transactions.amount,
						note: schema.transactions.note,
						account_id: schema.transactions.account_id,
						related_account_id: schema.transactions.related_account_id,
						category_id: schema.transactions.category_id,
						type: schema.transactions.type,
						created_date: schema.transactions.created_date,
						created_month: schema.transactions.created_month,
						created_year: schema.transactions.created_year,
						budget_id: schema.transactions.budget_id,
					},
				})
				.from(schema.transactions)
				.where(
					and(
						eq(schema.transactions.category_id, Number(categoryId)),
						eq(schema.transactions.created_month, todayDate.getMonth() + 1),
						eq(schema.transactions.created_year, todayDate.getFullYear())
					)
				)
				.innerJoin(
					schema.categories,
					eq(schema.transactions.category_id, schema.categories.id)
				)
				.innerJoin(
					schema.accounts,
					eq(schema.transactions.account_id, schema.accounts.id)
				);
		}

		return drizzleDb
			.select({
				accounts: schema.accounts,
				categories: schema.categories,
				transactions: {
					id: schema.transactions.id,
					amount: schema.transactions.amount,
					note: schema.transactions.note,
					account_id: schema.transactions.account_id,
					related_account_id: schema.transactions.related_account_id,
					category_id: schema.transactions.category_id,
					type: schema.transactions.type,
					created_date: schema.transactions.created_date,
					created_month: schema.transactions.created_month,
					created_year: schema.transactions.created_year,
					budget_id: schema.transactions.budget_id,
				},
			})
			.from(schema.transactions)
			.where(eq(schema.transactions.category_id, Number(categoryId)))
			.innerJoin(
				schema.categories,
				eq(schema.transactions.category_id, schema.categories.id)
			)
			.innerJoin(
				schema.accounts,
				eq(schema.transactions.account_id, schema.accounts.id)
			);
	}

	useFocusEffect(
		useCallback(() => {
			async function load() {
				const data = await fetcher(filter);
				setTransactions(data);
			}

			load();
		}, [categoryId, filter])
	);

	useEffect(() => {
		navigation.setOptions({
			title: categoryName,
		});
	}, []);

	return (
		<FlatList
			ListHeaderComponent={() => (
				<ListHeader setFilter={setFilter} selectedFilter={filter} />
			)}
			data={transactions}
			ListEmptyComponent={<NoItemNotice />}
			renderItem={({ item }) => (
				<TransactionCard
					account={item.accounts}
					category={item.categories}
					data={item.transactions}
					transactionType={item.transactions.type as any}
				/>
			)}
		/>
	);
}

type ListHeaderProps = {
	setFilter: Dispatch<SetStateAction<'all' | 'this-month'>>;
	selectedFilter: 'all' | 'this-month';
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
				<Button
					onPress={() => setFilter('all')}
					mode={selectedFilter === 'all' ? 'contained' : 'contained-tonal'}
					labelStyle={{ fontFamily: 'Inter-Regular' }}
				>
					All
				</Button>
				<Button
					onPress={() => setFilter('this-month')}
					mode={
						selectedFilter === 'this-month' ? 'contained' : 'contained-tonal'
					}
					labelStyle={{ fontFamily: 'Inter-Regular' }}
				>
					This month
				</Button>
			</View>
		</ScrollView>
	);
}
