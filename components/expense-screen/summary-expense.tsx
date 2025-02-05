import React from 'react';
import { View, Text } from 'react-native';

import { ExpenseDataTypes } from '@/context/ExpensesProvider';

interface SummaryExpense {
	reviews?: string;
	data: ExpenseDataTypes[];
}

function getIncomeAndSpending(data: ExpenseDataTypes[]) {
	let income = 0;
	let spending = 0;

	for (let i = 0; i < data.length; i++) {
		if (data[i].transaction_type === 'income') income += data[i].total;
		else spending += data[i].total;
	}

	return { income, spending };
}

const calculateExpenseStatistics = (expenses: ExpenseDataTypes[]) => {
	// Filter spending transactions
	const spendingExpenses = expenses.filter(
		(expense) => expense.transaction_type === 'spending'
	);

	// Calculate total daily spending
	const dailyTotals = spendingExpenses.reduce(
		(acc: { [date: string]: number }, expense) => {
			const date = new Date(expense.paid_at).toISOString().split('T')[0]; // Use the date part only
			acc[date] = (acc[date] || 0) + expense.total;
			return acc;
		},
		{}
	);

	// Calculate total weekly spending
	const weeklyTotals = spendingExpenses.reduce(
		(acc: { [week: string]: number }, expense) => {
			const date = new Date(expense.paid_at);
			const week = `${date.getFullYear()}-W${Math.ceil(
				(date.getDate() - date.getDay()) / 7
			)}`;
			acc[week] = (acc[week] || 0) + expense.total;
			return acc;
		},
		{}
	);

	// Calculate highest and lowest spending
	const allTotals = spendingExpenses.map((expense) => expense.total);
	const highestSpending = Math.max(...allTotals);
	const lowestSpending = Math.min(...allTotals);

	// Calculate average daily spending
	const avgDailySpending =
		Object.values(dailyTotals).reduce((acc, total) => acc + total, 0) /
		expenses.length;

	// Calculate average weekly spending
	const avgWeeklySpending =
		Object.values(weeklyTotals).reduce((acc, total) => acc + total, 0) / 4;

	return {
		avgDailySpending,
		avgWeeklySpending,
		highestSpending,
		lowestSpending,
	};
};

export default function SummaryExpense({ reviews, data }: SummaryExpense) {
	const { income, spending } = getIncomeAndSpending(data);
	const {
		avgDailySpending,
		avgWeeklySpending,
		highestSpending,
		lowestSpending,
	} = calculateExpenseStatistics(data);

	function renderReviews(reviews: string) {
		if (reviews === 'monthly')
			return (
				<MonthlyReview
					avgDailySpending={avgDailySpending}
					avgWeeklySpending={avgWeeklySpending}
					highestSpending={highestSpending}
					lowestSpending={lowestSpending}
				/>
			);
		if (reviews === 'yearly') return <YearlyReview />;
		return null;
	}

	const label =
		reviews === 'monthly'
			? 'This month'
			: reviews === 'yearly'
			? 'This year'
			: 'Today';

	return (
		<View>
			<View className="flex-row justify-between items-center gap-2 pb-4 px-6">
				<View className="flex-1 flex-row bg-[#9DEE77] p-2 rounded-lg h-20">
					<View>
						<Text className="text-[#033F00] text-sm">{label} income</Text>

						<Text
							className={`text-[#033F00] ${
								income >= 1000000000 ? 'text-base' : 'text-xl'
							}`}
						>
							Rp {income.toLocaleString('id-ID')}
						</Text>
					</View>
				</View>

				<View className="flex-1 flex-row bg-[#FFC5CE] p-2 rounded-lg h-20">
					<View>
						<Text className="text-[#9C041E] text-sm">{label} spending</Text>

						<Text
							className={`text-[#9C041E] ${
								spending > 1000000000 ? 'text-base' : 'text-xl'
							}`}
						>
							Rp {spending.toLocaleString('id-ID')}
						</Text>
					</View>
				</View>
			</View>

			{renderReviews(reviews as string)}
		</View>
	);
}

interface MonthlyReview {
	avgWeeklySpending: number;
	avgDailySpending: number;
	highestSpending: number;
	lowestSpending: number;
}

function MonthlyReview({
	avgDailySpending,
	avgWeeklySpending,
	highestSpending,
	lowestSpending,
}: MonthlyReview) {
	return (
		<View className="pt-4 px-6">
			<View className="flex-row justify-between w-full">
				<Text>Your avg. spending (weekly)</Text>
				<Text>Rp {avgWeeklySpending.toLocaleString('id-ID')}</Text>
			</View>

			<View className="flex-row justify-between">
				<Text>Your avg. spending (daily)</Text>
				<Text>Rp {avgDailySpending.toLocaleString('id-ID')}</Text>
			</View>

			<View className="flex-row justify-between">
				<Text>Highest spending</Text>
				<Text>Rp {highestSpending.toLocaleString('id-ID')}</Text>
			</View>

			<View className="flex-row justify-between">
				<Text>Lowest spending</Text>
				<Text>Rp {lowestSpending.toLocaleString('id-ID')}</Text>
			</View>
		</View>
	);
}

function YearlyReview() {
	return (
		<View className="pt-4 px-6">
			<View className="flex-row justify-between w-full">
				<Text>Your avg. spending (monthly)</Text>
				<Text>Rp 100.000</Text>
			</View>

			<View className="flex-row justify-between">
				<Text>Your avg. spending (monthly)</Text>
				<Text>Rp 50.000</Text>
			</View>

			<View className="flex-row justify-between">
				<Text>Highest spending</Text>
				<Text>Rp 50.000</Text>
			</View>

			<View className="flex-row justify-between">
				<Text>Lowest spending</Text>
				<Text>Rp 50.000</Text>
			</View>
		</View>
	);
}
