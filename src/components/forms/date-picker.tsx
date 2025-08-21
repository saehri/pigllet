import { CalendarIcon } from 'lucide-react-native';
import { Text, useTheme } from 'react-native-paper';
import { Pressable, StyleSheet } from 'react-native';
import { Dispatch, SetStateAction, useState } from 'react';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import moment from 'moment';

type Props = {
	setSelectedDate: Dispatch<SetStateAction<moment.MomentInput>>;
	selectedDate: moment.MomentInput;
};

export default function DatePicker({ selectedDate, setSelectedDate }: Props) {
	const theme = useTheme();
	const [open, setOpen] = useState<boolean>(false);

	// Function to open the date picker
	const openDatePicker = () => {
		setOpen(true);

		DateTimePickerAndroid.open({
			value: selectedDate as Date,
			mode: 'date',
			display: 'spinner',
			neutralButton: { textColor: theme.colors.onSurface },
			negativeButton: { textColor: theme.colors.onSurface },
			positiveButton: { textColor: theme.colors.onSurface },
			onChange: (event, date) => {
				if (date) {
					setSelectedDate(date);
					setOpen(false);
				}
			},
		});
	};

	return (
		<Pressable
			onPress={openDatePicker}
			style={[
				styles.selectBox,
				{
					backgroundColor: theme.colors.elevation.level5,
					borderColor: open
						? theme.colors.primary
						: theme.colors.outlineVariant,
				},
			]}
		>
			<Text
				style={[styles.selectText, { color: theme.colors.onSurface }]}
				numberOfLines={1}
			>
				{moment(selectedDate).format('MMM D, YYYY')}
			</Text>

			<CalendarIcon
				strokeWidth={1.5}
				size={20}
				color={theme.colors.onSurface}
			/>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	selectBox: {
		height: 50,
		padding: 8,
		paddingHorizontal: 16,
		gap: 12,
		borderWidth: 1,
		width: '100%',
		borderRadius: 16,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	selectText: {
		fontSize: 16,
		color: '#fff',
		textTransform: 'capitalize',
		fontFamily: 'Manrope-Regular',
	},
});

