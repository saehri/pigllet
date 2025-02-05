import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import LineCharts from '../linecharts';
import ArrowDownIcon from '@/assets/svg/arrow/keyboard-arrow-down.svg';
import { months } from '@/constants/months';
import CustomDatePicker from '../custom-date-picker';

interface ExpenseProps {
	selectedTab: string;
}

const ExpenseYearly = ({ selectedTab }: ExpenseProps) => {
	const [currentDate, setCurrentDate] = useState(new Date());

	return (
		<View>
			<View className="mb-8 flex-row justify-between px-6">
				<View className="w-[70%]">
					<Text className="text-slate-600 text-base">Showing expense for</Text>
					<Text className="text-2xl text-[#FF2C4A]" style={{ fontWeight: 800 }}>
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
		</View>
	);
};

export default ExpenseYearly;
