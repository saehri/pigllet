import { Dispatch, SetStateAction } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Calendar } from 'lucide-react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

type Props = {
	setSelectedDate: Dispatch<SetStateAction<Date>>;
	selectedDate: Date;
};

export default function DatePicker({ selectedDate, setSelectedDate }: Props) {
	const theme = useTheme();

	// Function to open the date picker
	const openDatePicker = () => {
		DateTimePickerAndroid.open({
			value: selectedDate,
			mode: 'date',
			display: 'spinner',
			neutralButton: { textColor: theme.colors.onSurface },
			negativeButton: { textColor: theme.colors.onSurface },
			positiveButton: { textColor: theme.colors.onSurface },
			onChange: (event, date) => {
				if (date) {
					setSelectedDate(date);
				}
			},
		});
	};

	return (
		<Pressable
			onPress={openDatePicker}
			style={[
				styles.selectBox,
				{ backgroundColor: theme.colors.surfaceVariant },
			]}
		>
			<Text style={styles.selectText} numberOfLines={1}>
				{selectedDate.toLocaleDateString('en-US', { dateStyle: 'long' })}
			</Text>

			<Calendar style={styles.icon} size={20} color={theme.colors.onSurface} />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	selectBox: {
		padding: 16,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		borderBottomWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	selectText: {
		fontSize: 16,
		color: '#fff',
		textTransform: 'capitalize',
	},
	icon: {
		position: 'absolute',
		right: 8,
	},
});
