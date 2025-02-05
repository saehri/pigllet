import { useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { ChartData } from '@/types/type';

import LineCharts from '../linecharts';
import SummaryExpense from './summary-expense';
import CustomDatePicker from '../custom-date-picker';
import ExpenseByCategory from './expense-by-category';

import { months } from '@/constants/months';
import ActivityCard from '../home-screen/activity-card';

import {
	ExpenseContext,
	ExpenseContextTypes,
} from '@/context/ExpensesProvider';

const data: ChartData = {
	labels: [
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'10',
		'11',
		'12',
		'13',
		'14',
		'15',
		'16',
	],
	datasets: [
		{
			data: [
				125000, 100000, 250000, 50000, 125000, 100000, 250000, 50000, 125000,
				100000, 250000, 50000, 125000, 100000, 250000, 50000,
			],
		},
	],
};

export default function ExpenseDaily() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const { loading, allExpenses } = useContext(
		ExpenseContext
	) as ExpenseContextTypes;

	if (loading)
		return (
			<View>
				<Text>Loading</Text>
			</View>
		);

	if (allExpenses.length === 0) {
		return (
			<View>
				<Text>You have no record</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 pt-16">
			<View className="mb-8 flex-row justify-between px-6">
				<View className="w-[70%]">
					<Text className="text-slate-600 text-base">Showing expense for</Text>
					<Text className="text-2xl text-[#FF2C4A]" style={{ fontWeight: 800 }}>
						{months[currentDate.getMonth()]} {currentDate.getDate()},{' '}
						{currentDate.getFullYear()}
					</Text>
				</View>

				<CustomDatePicker
					displayDate={false}
					currentDate={currentDate}
					setDate={setCurrentDate}
					maximumDate={new Date()}
				/>
			</View>

			<LineCharts data={data} currentDate={currentDate} />

			<SummaryExpense reviews="monthly" data={[]} />

			<ExpenseByCategory data={[]} />

			<View className="flex-1 w-full pt-6 bg-white">
				<View className="flex-row justify-between items-center px-6">
					<Text
						className="text-slate-900 font-bold text-lg tracking-tight"
						style={{ fontWeight: 800 }}
					>
						Recent Activity
					</Text>
				</View>

				<View id="activity" className="flex-col" style={{ marginTop: 8 }}>
					{allExpenses.map((expense: any) => (
						<ActivityCard
							transactionType="spending"
							category={expense.category}
							date={expense.paid_at}
							description={expense.description}
							total={expense.total}
							wallet={expense.wallet.wallet_name}
							key={expense.id}
							id={expense.id}
						/>
					))}
				</View>
			</View>
		</View>
	);
}
