import React, { useState } from 'react';
import { View, Text } from 'react-native';

import LineCharts from '../linecharts';
import ActivityCard from '../home-screen/activity-card';
import SummaryExpense from './summary-expense';
import ExpenseByCategory from './expense-by-category';
import CustomDatePicker from '../custom-date-picker';

import { months } from '@/constants/months';
import { ChartData } from '@/types/type';

interface ExpenseProps {
	selectedTab: string;
}

const data: ChartData = {
	labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
	datasets: [
		{
			data: [
				125000, 100000, 250000, 50000, 125000, 100000, 250000, 50000, 125000,
				100000, 250000, 50000,
			],
		},
	],
};

const ExpenseMonthly = ({ selectedTab }: ExpenseProps) => {
	const [currentDate, setCurrentDate] = useState(new Date());

	return (
		<View>
			<View className="mb-8 flex-row justify-between px-6">
				<View className="w-[70%]">
					<Text className="text-slate-600 text-base">Showing expense for</Text>
					<Text className="text-2xl text-[#FF2C4A]" style={{ fontWeight: 800 }}>
						{months[currentDate.getMonth()]}, {currentDate.getFullYear()}
					</Text>
				</View>

				<CustomDatePicker
					displayDate={false}
					currentDate={currentDate}
					setDate={setCurrentDate}
					maximumDate={new Date()}
				/>
			</View>

			<LineCharts currentDate={currentDate} data={data} />

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
					<ActivityCard
						transactionType={'spending'}
						description={''}
						date={''}
						wallet={''}
						total={0}
					/>
					<ActivityCard
						transactionType={'spending'}
						description={''}
						date={''}
						wallet={''}
						total={0}
					/>
					<ActivityCard
						transactionType={'spending'}
						description={''}
						date={''}
						wallet={''}
						total={0}
					/>
					<ActivityCard
						transactionType={'spending'}
						description={''}
						date={''}
						wallet={''}
						total={0}
					/>
					<ActivityCard
						transactionType={'spending'}
						description={''}
						date={''}
						wallet={''}
						total={0}
					/>
					<ActivityCard
						transactionType={'spending'}
						description={''}
						date={''}
						wallet={''}
						total={0}
					/>
					<ActivityCard
						transactionType={'spending'}
						description={''}
						date={''}
						wallet={''}
						total={0}
					/>
					<ActivityCard
						transactionType={'spending'}
						description={''}
						date={''}
						wallet={''}
						total={0}
					/>
				</View>
			</View>
		</View>
	);
};

export default ExpenseMonthly;
