import { days } from '@/constants/days';
import { View, Text } from 'react-native';

const Calendar = ({
	selectedYear,
	selectedMonth,
}: {
	selectedYear: number;
	selectedMonth: number;
}) => {
	const today = new Date();
	const todayDate = today.getDate();
	const todayYear = today.getFullYear();
	const todayMonth = today.getMonth();

	const isToday = (date: number) =>
		date === todayDate &&
		selectedMonth === todayMonth &&
		selectedYear === todayYear;

	// Generate dates
	const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
	const lastDateOfMonth = new Date(
		selectedYear,
		selectedMonth + 1,
		0
	).getDate();
	const lastDateOfLastMonth = new Date(
		selectedYear,
		selectedMonth,
		0
	).getDate();
	const lastDayOfMonth = new Date(
		selectedYear,
		selectedMonth,
		lastDateOfMonth
	).getDay();

	const prevDates = Array.from(
		{ length: firstDayOfMonth },
		(_, i) => lastDateOfLastMonth - firstDayOfMonth + i + 1
	);
	const currentDates = Array.from({ length: lastDateOfMonth }, (_, i) => i + 1);
	const nextDates = Array.from({ length: 6 - lastDayOfMonth }, (_, i) => i + 1);

	const renderDate = (
		date: number,
		isCurrent: boolean,
		isToday: boolean,
		key: string
	) => (
		<View
			key={key}
			className={`items-center justify-center rounded-lg ${
				isCurrent && isToday
					? 'bg-red-300'
					: isCurrent
					? 'bg-slate-100'
					: 'bg-slate-50'
			}`}
			style={{ width: '13.7%', height: 48 }}
		>
			<Text
				className={`text-sm ${isCurrent ? 'text-slate-900' : 'text-gray-400'}`}
			>
				{date}
			</Text>
		</View>
	);

	return (
		<View className="px-6">
			{/* Days Header */}
			<View className="flex-row items-center justify-between bg-slate-100 p-1 rounded-md border border-slate-200">
				{days.map((day, i) => (
					<Text key={i} className="flex-1 text-base text-center text-slate-600">
						{day}
					</Text>
				))}
			</View>

			{/* Calendar Dates */}
			<View
				className="flex-row flex-wrap justify-start mt-8"
				style={{ gap: 2 }}
			>
				{prevDates.map((date, i) =>
					renderDate(date, false, false, `prev-${i}`)
				)}
				{currentDates.map((date, i) =>
					renderDate(date, true, isToday(date), `current-${i}`)
				)}
				{nextDates.map((date, i) =>
					renderDate(date, false, false, `next-${i}`)
				)}
			</View>
		</View>
	);
};

export default Calendar;
