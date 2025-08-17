import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Dispatch, memo, SetStateAction, useState } from 'react';

const months = [
	{ label: 'January', value: 0 },
	{ label: 'February', value: 1 },
	{ label: 'March', value: 2 },
	{ label: 'April', value: 3 },
	{ label: 'May', value: 4 },
	{ label: 'June', value: 5 },
	{ label: 'July', value: 6 },
	{ label: 'August', value: 7 },
	{ label: 'September', value: 8 },
	{ label: 'October', value: 9 },
	{ label: 'November', value: 10 },
	{ label: 'December', value: 11 },
];

type Props = {
	selectedDate: Date;
	setSelectedDate: Dispatch<SetStateAction<Date>>;
};

function MonthPicker({ selectedDate, setSelectedDate }: Props) {
	const theme = useTheme();

	const [open, setOpened] = useState(false);
	const [pickedMonth, setMonths] = useState<number>(
		months[selectedDate.getMonth()].value
	);

	const handleValueChange = (itemValue: number) => {
		setMonths(itemValue);
		const date = new Date();
		date.setMonth(itemValue);

		setSelectedDate(date);
	};

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.colors.elevation.level5,
					borderColor: open
						? theme.colors.primary
						: theme.colors.outlineVariant,
				},
			]}
		>
			<Picker
				mode="dropdown"
				selectedValue={pickedMonth}
				onValueChange={handleValueChange}
				style={{
					color: theme.colors.onSurface,
					backgroundColor: theme.colors.elevation.level5,
					borderRadius: 12,
					fontFamily: 'Manrope-Medium',
				}}
				dropdownIconColor={theme.colors.onSurface}
				onFocus={() => setOpened(true)}
				onBlur={() => setOpened(false)}
			>
				{months.map((month) => (
					<Picker.Item
						key={month.label}
						label={month.label}
						value={month.value}
						fontFamily="Manrope-Regular"
						color={
							pickedMonth === month.value
								? theme.colors.primary
								: theme.colors.onSurface
						}
						style={{
							backgroundColor: theme.colors.elevation.level5,
						}}
					/>
				))}
			</Picker>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 6,
		borderRadius: 16,
		overflow: 'hidden',
		flex: 1,
		height: 50,
		borderWidth: 1,
	},
});

export default memo(MonthPicker);

