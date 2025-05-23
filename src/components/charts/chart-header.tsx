import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { ArrowRightIcon } from 'lucide-react-native';

type Props = {
	startDate: Date;
	setStartDate: Dispatch<SetStateAction<Date>>;
	endDate: Date;
	setEndDate: Dispatch<SetStateAction<Date>>;
};

export default function ChartHeader({
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}: Props) {
	const theme = useTheme();

	// Function to open the date picker
	const openStartDatePicker = () => {
		DateTimePickerAndroid.open({
			value: startDate,
			mode: 'date',
			display: 'default',
			onChange: (event, date) => {
				if (date) {
					setStartDate(date);
				}
			},
		});
	};

	// Function to open the date picker
	const openEndDatePicker = () => {
		DateTimePickerAndroid.open({
			value: endDate,
			mode: 'date',
			display: 'default',
			onChange: (event, date) => {
				if (date) {
					setEndDate(date);
				}
			},
		});
	};

	return (
		<View style={styles.container}>
			<Button
				onPress={openStartDatePicker}
				mode="outlined"
				labelStyle={styles.buttonLabel}
				style={[styles.button, { borderColor: theme.colors.outlineVariant }]}
			>
				{startDate.toLocaleDateString('en-US', { dateStyle: 'medium' })}
			</Button>

			<View
				style={[
					styles.iconDividerContainer,
					{ backgroundColor: theme.colors.primary },
				]}
			>
				<ArrowRightIcon strokeWidth={1.5} color={theme.colors.background} />
			</View>

			<Button
				onPress={openEndDatePicker}
				mode="outlined"
				labelStyle={styles.buttonLabel}
				style={[styles.button, { borderColor: theme.colors.outlineVariant }]}
			>
				{endDate.toLocaleDateString('en-US', { dateStyle: 'medium' })}
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
		padding: 16,
	},
	buttonLabel: {
		fontFamily: 'Inter-Regular',
	},
	button: {
		flex: 1,
		borderRadius: 11,
	},
	iconDividerContainer: {
		width: 28,
		height: 28,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

