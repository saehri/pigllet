import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { Calendar } from 'lucide-react-native';

import * as schema from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';

import { groupedTransactionsByDate } from '@/utils/group-transactions';

import ExpenseCard from '@/src/components/reusables/expense-card';
import TransactionsSummaryChart from '@/src/components/transactions/transactions-summary-chart';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function ExpensesScreen() {
	const theme = useTheme();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [todayDate] = useState<Date>(new Date());
	const [transactions, setTransactions] = useState<schema.Transaction>(
		[] as any
	);

	useEffect(() => {
		loadExpenseData();
	}, []);

	async function loadExpenseData() {
		const data = await drizzleDb
			.select({
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
				category: schema.categories,
				accountName: schema.accounts.name,
			})
			.from(schema.transactions)
			.where(
				and(
					eq(schema.transactions.type, 'expense'),
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
			)
			.orderBy(desc(schema.transactions.created_date));

		setTransactions(data as any);
	}

	return (
		<FlatList
			refreshControl={
				<RefreshControl
					refreshing={false}
					onRefresh={loadExpenseData}
					progressViewOffset={50}
				/>
			}
			style={{ backgroundColor: theme.colors.background }}
			data={groupedTransactionsByDate(transactions as any)}
			ListHeaderComponent={() => (
				<View
					style={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: 60 }}
				>
					<TransactionsSummaryChart
						header={<DatePicker />}
						transactions={transactions as any}
					/>
				</View>
			)}
			keyExtractor={(item) => item.created_date.toString()}
			renderItem={({ item }) => (
				<View
					style={{
						paddingBottom: 18,
						gap: 8,
					}}
				>
					<Text
						style={{
							fontFamily: 'Inter-Regular',
							paddingHorizontal: 16,
							fontSize: 18,
						}}
					>
						{new Date(
							`${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${item.created_date}`
						).toLocaleDateString('en-US', {
							dateStyle: 'long',
							month: 'short',
						})}
					</Text>

					<View>
						{item.transactions.map((transaction: any) => (
							<ExpenseCard
								key={transaction.id}
								data={transaction as any}
								category={transaction.category as schema.TransactionCategories}
								accountName={transaction.accountName}
							/>
						))}
					</View>
				</View>
			)}
		/>
	);
}

function DatePicker() {
	const theme = useTheme();
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	const openDatePicker = () => {
		DateTimePickerAndroid.open({
			value: selectedDate,
			mode: 'date',
			display: 'spinner',
			neutralButton: { textColor: theme.colors.onSurface },
			negativeButton: { textColor: theme.colors.onSurface },
			positiveButton: { textColor: theme.colors.onSurface },
			onChange: (event, date) => {
				if (date) {
					setSelectedDate(date);
				}
			},
		});
	};

	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				width: '100%',
				alignItems: 'center',
				marginBottom: 12,
			}}
		>
			<Text style={{ fontFamily: 'Inter-Regular' }} variant="titleLarge">
				March 2025
			</Text>

			<Button
				onPress={openDatePicker}
				contentStyle={{ flexDirection: 'row-reverse', gap: 8 }}
				labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
				compact
			>
				<Calendar size={20} color={theme.colors.onSurface} />
			</Button>
		</View>
	);
}
