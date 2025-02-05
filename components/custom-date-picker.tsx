import React, { Dispatch, SetStateAction, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import CalendarIcon from '@/assets/svg/calendar.svg';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { months } from '@/constants/months';
import { days } from '@/constants/days';

interface CustomDatePicker {
	currentDate: Date;
	setDate: Dispatch<SetStateAction<Date>>;
	displayDate: boolean;
	maximumDate?: Date;
	displayDay?: boolean;
}

export default function CustomDatePicker({
	currentDate,
	setDate,
	displayDate,
	maximumDate,
	displayDay,
}: CustomDatePicker) {
	const [open, setOpen] = useState<boolean>(false);

	function handleChange(newDate: Date) {
		setOpen(!open);
		setDate(newDate);
	}

	const dateString = displayDay
		? `${currentDate.getDate()} ${
				months[currentDate.getMonth()]
		  }, ${currentDate.getFullYear()}`
		: `${months[currentDate.getMonth()]}, ${currentDate.getFullYear()}`;

	return (
		<>
			<TouchableOpacity
				onPress={() => setOpen(!open)}
				className={`${
					displayDate ? 'px-3 h-12 justify-between' : 'w-12 h-12 justify-center'
				} gap-4  border border-red-100 rounded-xl flex-row items-center place-content-end`}
			>
				{displayDate && <Text className="text-slate-900">{dateString}</Text>}
				<CalendarIcon />
			</TouchableOpacity>

			{open && (
				<RNDateTimePicker
					mode="date"
					display="default"
					value={currentDate}
					onChange={(e, date) => handleChange(date || new Date())}
					maximumDate={maximumDate && new Date()}
				/>
			)}
		</>
	);
}
