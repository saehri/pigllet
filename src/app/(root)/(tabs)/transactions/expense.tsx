import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, desc, eq } from 'drizzle-orm';
import * as schema from '@/db/schema';

import groupedTransactions from '@/utils/group-transactions';

import { BarChart, barDataItem } from 'react-native-gifted-charts';

import ExpenseCard from '@/src/components/reusables/expense-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';

export default function ExpensesScreen() {
	const theme = useTheme();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [todayDate] = useState<Date>(new Date());

	const { data: transactions } = useLiveQuery(
		drizzleDb
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
			.orderBy(desc(schema.transactions.created_date))
	);

	return (
		<FlatList
			style={{ paddingTop: 60, backgroundColor: theme.colors.background }}
			data={groupedTransactions(transactions)}
			ListHeaderComponent={() => (
				<View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
					<Surface
						mode="flat"
						elevation={4}
						style={{
							borderRadius: 20,
							overflow: 'hidden',
							padding: 16,
							paddingBottom: 0,
							paddingLeft: 12,
							alignItems: 'center',
						}}
					>
						<TransactionBasicChart />
					</Surface>
				</View>
			)}
			ListEmptyComponent={<NoItemNotice />}
			renderItem={({ item }) => (
				<View style={{ paddingBottom: 24, gap: 8 }}>
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
								showsDate={false}
							/>
						))}
					</View>
				</View>
			)}
		/>
	);
}

function TransactionBasicChart() {
	const theme = useTheme();

	const data: barDataItem[] = [
		{ value: 400000, label: 'A' },
		{ value: 30000, label: 'B' },
		{ value: 200000, label: 'C' },
		{ value: 10000, label: 'D' },
	];

	return (
		<BarChart
			data={data}
			backgroundColor={theme.colors.elevation.level4} // Sets the chart background
			frontColor={theme.colors.primary} // Main color for bars
			rulesThickness={1} // Thin grid lines for subtlety
			rulesColor={theme.colors.elevation.level5} // Grid color matching the theme
			roundedTop // Adds rounded edges to the top of bars
			barWidth={30} // Adjust bar width for proportionate spacing
			barBorderRadius={6} // Smoothens edges for a modern look
			indicatorColor={'default'} // White indicator line
			capColor={'#FF0000'} // Red cap color (Top end of bars)
			color={'#00FF00'} // Base color for bars (Green in this case)
			lineBehindBars={false} // Keeps bars visually distinct
			yAxisTextStyle={{
				fontFamily: 'Inter-Regular',
				fontSize: 11, // Adjust axis labels for clarity
				color: theme.colors.onSurfaceVariant,
			}}
			xAxisLabelTextStyle={{
				fontFamily: 'Inter-Regular',
				fontSize: 12,
				fontWeight: '500',
				color: theme.colors.onSurfaceVariant,
			}}
			spacing={12} // Provides spacing between bars
			isAnimated // Adds smooth animation for better UX
		/>
	);
}
