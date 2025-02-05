import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import DateTimePicker, {
	DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import CalendarIcon from '@/assets/svg/calendar.svg';
import ArrowDropDown from '@/assets/svg/arrow/arrow-drop-down.svg';

const BirthdayGenderForm = ({ setBirthday, setGender }: any) => {
	const [date, setDate] = useState<Date>(new Date());
	const [gender, setGenderState] = useState<string>('Male');
	const [showCalendar, setShowCalendar] = useState<boolean>(false);
	const [showGender, setShowGender] = useState<boolean>(false);

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}).format(date);
	};

	const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
		const currentDate = selectedDate || date;
		setDate(currentDate);
		setShowCalendar(false);
		setBirthday(formatDate(currentDate));
	};

	const showDatepicker = () => {
		setShowCalendar(true);
	};

	const toggleGenderDropdown = () => {
		setShowGender((prev) => !prev);
	};

	const handleGenderSelect = (selectedGender: string) => {
		setGenderState(selectedGender);
		setGender(selectedGender); // Update gender state
		setShowGender(false);
	};

	return (
		<View className="flex-1 flex-row justify-center items-center w-full gap-2 mb-4">
			<View className="w-[48%]">
				<Text className="text-base mb-2">Birthday</Text>
				<Pressable
					className="relative border flex-row justify-evenly items-center border-slate-300 rounded-full p-3"
					onPress={showDatepicker}
				>
					<Text className="text-ellipsis overflow-hidden whitespace-nowrap text-sm text-slate-900">
						{formatDate(date)}
					</Text>
					<CalendarIcon />
				</Pressable>
			</View>

			{showCalendar && (
				<DateTimePicker
					testID="dateTimePicker"
					value={date}
					mode="date"
					display="default"
					onChange={onChange}
					locale="en"
				/>
			)}

			<View className="w-[48%]">
				<Text className="text-base mb-2">Gender</Text>
				<Pressable
					className="relative border flex-row justify-between items-center border-slate-300 rounded-full p-3"
					onPress={toggleGenderDropdown}
				>
					<Text className="text-ellipsis overflow-hidden whitespace-nowrap text-sm">
						{gender}
					</Text>
					<ArrowDropDown />
				</Pressable>

				{showGender && (
					<View className="absolute w-full top-24 z-20 border border-slate-300 bg-white rounded-xl">
						<Pressable
							className="border-b border-slate-300 p-3"
							onPress={() => handleGenderSelect('Male')}
						>
							<Text className="text-sm">Male</Text>
						</Pressable>
						<Pressable
							className="border-b border-slate-300 p-3"
							onPress={() => handleGenderSelect('Female')}
						>
							<Text className="text-sm">Female</Text>
						</Pressable>
					</View>
				)}
			</View>
		</View>
	);
};

export default BirthdayGenderForm;
