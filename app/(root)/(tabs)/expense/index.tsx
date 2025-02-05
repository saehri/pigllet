import { useContext, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
	ExpenseContext,
	ExpenseContextTypes,
} from '@/context/ExpensesProvider';

import CustomDatePicker from '@/components/custom-date-picker';
import SummaryExpense from '@/components/expense-screen/summary-expense';
import ExpenseByCategory from '@/components/expense-screen/expense-by-category';

import { months } from '@/constants/months';
import LineCharts from '@/components/linecharts';
import { chartDataTransformer } from '@/utils/chart-data-transformer';
import RecentActivities from '@/components/home-screen/recent-activities';

export default function ExpenseScreen() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const { getExpensesByDate, getExpensesByMonth } = useContext(
		ExpenseContext
	) as ExpenseContextTypes;

	return (
		<ScrollView
			className="flex-1 h-full bg-white"
			contentContainerStyle={{ paddingBottom: 100 }}
			showsVerticalScrollIndicator={false}
		>
			<View className="flex-1 pt-16">
				<View className="mb-8 flex-row justify-between px-6">
					<View className="w-[70%]">
						<Text className="text-slate-600 text-base">
							Showing expense for
						</Text>
						<Text
							className="text-2xl text-[#FF2C4A]"
							style={{ fontWeight: 800 }}
						>
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

				<LineCharts
					data={chartDataTransformer(getExpensesByMonth(currentDate))}
					currentDate={currentDate}
				/>

				<SummaryExpense
					reviews="monthly"
					data={getExpensesByMonth(currentDate)}
				/>

				<ExpenseByCategory data={getExpensesByDate(currentDate)} />

				<RecentActivities
					showDetailsButton={false}
					activities={getExpensesByDate(currentDate)}
				/>
			</View>
		</ScrollView>
	);
}
