import { Dispatch, SetStateAction, useState } from 'react';
import { months } from '@/constants/months';
import { View, Text, TouchableOpacity } from 'react-native';

import ArrowRightIcon from '@/assets/svg/arrow/keyboard-arrow-right.svg';
import ArrowDownIcon from '@/assets/svg/arrow/keyboard-arrow-down.svg';

interface MonthPicker {
	selectedMonth: number;
	selectedYear: number;
	setSelectedMonth: Dispatch<SetStateAction<number>>;
}

export default function MonthPicker({
	selectedMonth,
	selectedYear,
	setSelectedMonth,
}: MonthPicker) {
	const [isModalVisible, setIsModalVisible] = useState(false);

	return (
		<View>
			<View className="flex-row justify-between mb-8">
				<View>
					<Text className="text-base text-slate-600 tracking-tight">
						Your total this month
					</Text>
					<Text
						className="text-2xl text-[#FF2C4A] tracking-tight"
						style={{ fontWeight: 800 }}
					>
						Rp 605,000
					</Text>
				</View>

				<TouchableOpacity
					className="flex-row items-center justify-center w-auto px-4 h-10 border border-red-100 rounded-lg"
					onPress={() => setIsModalVisible(!isModalVisible)}
				>
					<Text className="text-slate-900 text-lg tracking-tight">
						{months[selectedMonth]}, {selectedYear}
					</Text>

					{isModalVisible ? <ArrowDownIcon /> : <ArrowRightIcon />}
				</TouchableOpacity>
			</View>

			{isModalVisible && (
				<View className="absolute bg-white border border-red-100 rounded-xl top-12 right-0 w-[175px] p-2 z-40 flex-row flex-wrap justify-between gap-1 shadow-xl">
					{months.map((month, i) => (
						<TouchableOpacity
							key={i}
							className={`w-full p-2 rounded-lg ${
								i === selectedMonth
									? 'bg-[#FF4863] border-[#FF6A83] '
									: 'bg-white'
							}`}
							onPress={() => {
								setSelectedMonth(i);
								setIsModalVisible(false);
							}}
						>
							<Text
								className={`text-left text-lg	 ${
									i === selectedMonth ? 'text-white' : 'text-slate-600'
								}`}
							>
								{month}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	);
}
